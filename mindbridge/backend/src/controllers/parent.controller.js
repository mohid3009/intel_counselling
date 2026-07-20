const prisma = require('../prisma');
const { sendAppointmentEmail } = require('../services/email.service');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const { handleError } = require('../utils/errorHandler');

// ── Dashboard ─────────────────────────────────────────────────

async function getDashboard(req, res) {
  try {
    const parentId = req.user.id;

    const parent = await prisma.user.findUnique({
      where: { id: parentId },
      include: {
        familyAsParent: {
          include: {
            students: {
              include: {
                testResults: {
                  take: 5,
                  orderBy: { takenAt: 'desc' },
                  include: { test: { select: { name: true, category: true } } },
                },
                alerts: {
                  where: { status: 'UNREAD' },
                },
              },
            },
          },
        },
      },
    });

    const children = parent?.familyAsParent?.students || [];

    res.json({ parent, children });
  } catch (err) {
    handleError(res, err, 'getDashboard (parent)');
  }
}

// ── Children ──────────────────────────────────────────────────

async function getChildren(req, res) {
  try {
    const parent = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        familyAsParent: {
          include: {
            students: {
              select: {
                id: true, firstName: true, lastName: true,
                grade: true, dateOfBirth: true, avatarUrl: true,
                school: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    const children = parent?.familyAsParent?.students || [];
    res.json({ children });
  } catch (err) {
    handleError(res, err, 'getChildren');
  }
}

async function getChildResults(req, res) {
  try {
    const { childId } = req.params;
    const { skip, take, page, limit } = parsePagination(req.query);

    // Verify child belongs to parent's family
    const parent = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { familyAsParent: { include: { students: { select: { id: true } } } } },
    });
    const childIds = parent?.familyAsParent?.students.map(s => s.id) || [];
    if (!childIds.includes(childId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [results, total] = await Promise.all([
      prisma.testResult.findMany({
        where: { studentId: childId },
        skip,
        take,
        orderBy: { takenAt: 'desc' },
        include: { test: { select: { name: true, category: true } } },
      }),
      prisma.testResult.count({ where: { studentId: childId } }),
    ]);

    res.json({ results, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    handleError(res, err, 'getChildResults');
  }
}

async function getChildResult(req, res) {
  try {
    const { childId, resultId } = req.params;

    // Verify child belongs to parent's family
    const parent = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { familyAsParent: { include: { students: { select: { id: true } } } } },
    });
    const childIds = parent?.familyAsParent?.students.map(s => s.id) || [];
    if (!childIds.includes(childId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await prisma.testResult.findFirst({
      where: { id: resultId, studentId: childId },
      include: { test: true },
    });

    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ result });
  } catch (err) {
    handleError(res, err, 'getChildResult');
  }
}

// ── Appointments ──────────────────────────────────────────────

async function bookAppointment(req, res) {
  try {
    const { childId, psychiatristId, slot, notes, meetingLink } = req.body;

    // Verify child belongs to parent's family
    const parent = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { familyAsParent: { include: { students: { select: { id: true } } } } },
    });
    const childIds = parent?.familyAsParent?.students.map(s => s.id) || [];
    if (!childIds.includes(childId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get last 3 results for the child
    const recentResults = await prisma.testResult.findMany({
      where: { studentId: childId },
      take: 3,
      orderBy: { takenAt: 'desc' },
    });

    const appointment = await prisma.appointment.create({
      data: {
        patientId: childId,
        psychiatristId,
        slot: new Date(slot),
        notes,
        meetingLink,
        results: { connect: recentResults.map(r => ({ id: r.id })) },
      },
      include: {
        patient: true,
        psychiatrist: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    // Email parent
    try {
      await sendAppointmentEmail({
        to: req.user.email,
        parentName: `${parent.firstName} ${parent.lastName}`,
        studentName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        psychiatristName: `${appointment.psychiatrist.firstName} ${appointment.psychiatrist.lastName}`,
        slot,
        notes,
        meetingLink,
      });
    } catch (emailErr) {
      console.error('Appointment email error:', emailErr);
    }

    res.status(201).json({ appointment });
  } catch (err) {
    handleError(res, err, 'bookAppointment');
  }
}

async function getAppointments(req, res) {
  try {
    const parent = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { familyAsParent: { include: { students: { select: { id: true } } } } },
    });
    const childIds = parent?.familyAsParent?.students.map(s => s.id) || [];

    const appointments = await prisma.appointment.findMany({
      where: { patientId: { in: childIds } },
      orderBy: { slot: 'desc' },
      include: {
        patient: { select: { firstName: true, lastName: true, grade: true } },
        psychiatrist: { select: { firstName: true, lastName: true } },
        results: { include: { test: { select: { name: true } } } },
      },
    });

    res.json({ appointments });
  } catch (err) {
    handleError(res, err, 'getAppointments (parent)');
  }
}

module.exports = { getDashboard, getChildren, getChildResults, getChildResult, bookAppointment, getAppointments };
