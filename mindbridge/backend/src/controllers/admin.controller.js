const prisma = require('../prisma');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const { generateCredentials, regeneratePassword } = require('../services/credential.service');
const { sendCredentialsEmail } = require('../services/email.service');
const logger = require('../utils/logger');
const { handleError } = require('../utils/errorHandler');
const crypto = require('crypto');

// ── Dashboard ─────────────────────────────────────────────────

async function getDashboard(req, res) {
  try {
    const [
      totalSchools,
      totalStudents,
      totalParents,
      alertsThisMonth,
      recentAlerts,
      testStats,
      severeNoAppointmentResults,
    ] = await Promise.all([
      prisma.school.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      prisma.user.count({ where: { role: 'PARENT', isActive: true } }),
      prisma.alert.count({
        where: { firedAt: { gte: new Date(new Date().setDate(1)) } },
      }),
      prisma.alert.findMany({
        take: 5,
        orderBy: { firedAt: 'desc' },
        include: {
          student: { select: { firstName: true, lastName: true, school: { select: { name: true } } } },
        },
      }),
      prisma.test.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          category: true,
          _count: {
            select: { results: true },
          },
        },
      }),
      prisma.testResult.findMany({
        where: {
          isLow: true,
          appointments: { none: {} },
        },
        orderBy: { takenAt: 'desc' },
        include: {
          student: { select: { firstName: true, lastName: true, email: true, phone: true } },
          test: { select: { name: true } },
        },
      }),
    ]);

    res.json({
      stats: { totalSchools, totalStudents, totalParents, alertsThisMonth },
      recentAlerts,
      testStats,
      severeNoAppointmentResults,
    });
  } catch (err) {
    handleError(res, err, 'getDashboard');
  }
}

async function toggleChecklistResult(req, res) {
  try {
    const { id } = req.params;
    const { checked } = req.body;
    const result = await prisma.testResult.update({
      where: { id },
      data: { checklistChecked: !!checked },
    });
    res.json({ message: 'Checklist status updated successfully', result });
  } catch (err) {
    handleError(res, err, 'toggleChecklistResult');
  }
}

// ── Schools ───────────────────────────────────────────────────

async function createSchool(req, res) {
  try {
    const { name, address, contactEmail, contactPhone } = req.body;
    if (!name || !contactEmail) {
      return res.status(400).json({ error: 'Name and contact email required' });
    }

    // Generate unique 6-char access code
    let accessCode;
    let unique = false;
    while (!unique) {
      accessCode = generateAccessCode();
      const existing = await prisma.school.findUnique({ where: { accessCode } });
      if (!existing) unique = true;
    }

    const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : null;

    const school = await prisma.school.create({
      data: { name, address, contactEmail, contactPhone, accessCode, logoUrl },
    });

    res.status(201).json({ school, accessCode });
  } catch (err) {
    handleError(res, err, 'createSchool');
  }
}

async function getSchools(req, res) {
  try {
    const { skip, take, page, limit } = parsePagination(req.query);
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { users: true, families: true } },
        },
      }),
      prisma.school.count(),
    ]);
    res.json({ schools, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    handleError(res, err, 'getSchools');
  }
}

async function updateSchool(req, res) {
  try {
    const { id } = req.params;
    const { name, address, contactEmail, contactPhone, isActive } = req.body;
    const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : undefined;

    const school = await prisma.school.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(contactEmail && { contactEmail }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(isActive !== undefined && { isActive }),
        ...(logoUrl && { logoUrl }),
      },
    });
    res.json({ school });
  } catch (err) {
    handleError(res, err, 'updateSchool');
  }
}

async function getSchoolStudents(req, res) {
  try {
    const { id } = req.params;
    const { skip, take, page, limit } = parsePagination(req.query);

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where: { schoolId: id, role: 'STUDENT' },
        skip,
        take,
        orderBy: { lastName: 'asc' },
        include: {
          testResults: {
            take: 1,
            orderBy: { takenAt: 'desc' },
            include: { test: { select: { name: true } } },
          },
          _count: { select: { alerts: true } },
        },
      }),
      prisma.user.count({ where: { schoolId: id, role: 'STUDENT' } }),
    ]);

    res.json({ students, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    handleError(res, err, 'getSchoolStudents');
  }
}

// ── Family Creation ───────────────────────────────────────────

async function createFamily(req, res) {
  try {
    const { id: schoolId } = req.params;
    const { students: studentData, parents: parentData } = req.body;

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) return res.status(404).json({ error: 'School not found' });

    const generatedCredentials = [];

    const family = await prisma.family.create({ data: { schoolId } });

    // Create students
    for (const s of studentData) {
      const creds = await generateCredentials(s.firstName, s.lastName, school.accessCode);
      const student = await prisma.user.create({
        data: {
          email: creds.email,
          passwordHash: creds.passwordHash,
          role: 'STUDENT',
          firstName: s.firstName,
          lastName: s.lastName,
          grade: s.grade,
          dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth) : null,
          schoolId,
          familyStudentId: family.id,
          mustResetPassword: true,
        },
      });
      generatedCredentials.push({
        id: student.id,
        name: `${s.firstName} ${s.lastName}`,
        email: creds.email,
        password: creds.plainPassword,
        role: 'STUDENT',
      });
    }

    // Create parents
    for (const p of parentData) {
      const creds = await generateCredentials(p.firstName, p.lastName, school.accessCode);
      const parent = await prisma.user.create({
        data: {
          email: creds.email,
          passwordHash: creds.passwordHash,
          role: 'PARENT',
          firstName: p.firstName,
          lastName: p.lastName,
          phone: p.phone,
          schoolId,
          familyParentId: family.id,
          mustResetPassword: true,
        },
      });
      generatedCredentials.push({
        id: parent.id,
        name: `${p.firstName} ${p.lastName}`,
        email: creds.email,
        password: creds.plainPassword,
        role: 'PARENT',
      });
    }

    res.status(201).json({ family, credentials: generatedCredentials });
  } catch (err) {
    handleError(res, err, 'createFamily');
  }
}

// ── Users ─────────────────────────────────────────────────────

async function getUsers(req, res) {
  try {
    const { skip, take, page, limit } = parsePagination(req.query);
    const { role, schoolId, isActive, search } = req.query;

    const where = {
      ...(role && { role }),
      ...(schoolId && { schoolId }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          grade: true,
          isActive: true,
          mustResetPassword: true,
          createdAt: true,
          school: { select: { id: true, name: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    handleError(res, err, 'getUsers');
  }
}

async function toggleUserActive(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    res.json({ user: updated });
  } catch (err) {
    handleError(res, err, 'toggleUserActive');
  }
}

async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { plainPassword, passwordHash } = await regeneratePassword();
    await prisma.user.update({
      where: { id },
      data: { passwordHash, mustResetPassword: true },
    });

    res.json({ email: user.email, newPassword: plainPassword });
  } catch (err) {
    handleError(res, err, 'resetUserPassword');
  }
}

// ── Bulk Credentials ──────────────────────────────────────────

async function generateBulkCredentials(req, res) {
  try {
    const { id: schoolId } = req.params;
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) return res.status(404).json({ error: 'School not found' });

    if (!req.file) return res.status(400).json({ error: 'CSV file required' });

    const csvContent = require('fs').readFileSync(req.file.path, 'utf8');
    const lines = csvContent.split('\n').slice(1).filter(Boolean);

    const results = [];
    for (const line of lines) {
      const [first_name, last_name, role, grade, parent_email] = line.split(',').map(s => s.trim().replace(/"/g, ''));
      if (!first_name || !last_name || !role) continue;

      const validRole = ['STUDENT', 'PARENT', 'PSYCHIATRIST'].includes(role.toUpperCase());
      if (!validRole) continue;

      const creds = await generateCredentials(first_name, last_name, school.accessCode);
      const user = await prisma.user.create({
        data: {
          email: creds.email,
          passwordHash: creds.passwordHash,
          role: role.toUpperCase(),
          firstName: first_name,
          lastName: last_name,
          grade: grade || null,
          schoolId,
          mustResetPassword: true,
        },
      });

      results.push({ name: `${first_name} ${last_name}`, email: creds.email, password: creds.plainPassword, role: role.toUpperCase() });
    }

    res.json({ generated: results.length, credentials: results });
  } catch (err) {
    handleError(res, err, 'generateBulkCredentials');
  }
}

// ── Helper ────────────────────────────────────────────────────

function generateAccessCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return code;
}

module.exports = {
  getDashboard,
  toggleChecklistResult,
  createSchool,
  getSchools,
  updateSchool,
  getSchoolStudents,
  createFamily,
  getUsers,
  toggleUserActive,
  resetUserPassword,
  generateBulkCredentials,
};
