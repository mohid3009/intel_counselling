const prisma = require('../prisma');
const { interpretScore } = require('../utils/scoreInterpreter');
const { createAlertAndNotify } = require('../services/alert.service');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const { handleError } = require('../utils/errorHandler');

// ── Dashboard ─────────────────────────────────────────────────

async function getDashboard(req, res) {
  try {
    const studentId = req.user.id;

    const [tests, recentResults, concerns, student] = await Promise.all([
      prisma.test.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }),
      prisma.testResult.findMany({
        where: { studentId },
        take: 5,
        orderBy: { takenAt: 'desc' },
        include: { test: { select: { name: true, category: true } } },
      }),
      prisma.concern.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.user.findUnique({
        where: { id: studentId },
        include: { school: { select: { name: true } } },
      }),
    ]);

    // Get latest result per test category
    const latestByCategory = {};
    for (const result of recentResults) {
      const cat = result.test.category;
      if (!latestByCategory[cat]) latestByCategory[cat] = result;
    }

    res.json({ student, tests, recentResults, latestByCategory: Object.values(latestByCategory), concerns });
  } catch (err) {
    handleError(res, err, 'getDashboard (student)');
  }
}

// ── Tests ─────────────────────────────────────────────────────

async function getTests(req, res) {
  try {
    const tests = await prisma.test.findMany({ where: { isActive: true } });
    res.json({ tests });
  } catch (err) {
    handleError(res, err, 'getTests');
  }
}

async function submitTest(req, res) {
  try {
    const { testId } = req.params;
    const { answers, shareWithTherapist, takenByName, takenByUsername, takenByPhone } = req.body;
    const studentId = req.user.id;

    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const questions = test.questions;
    const thresholds = test.thresholds;

    // Calculate score
    let score = 0;
    if (Array.isArray(answers)) {
      score = answers.reduce((sum, a) => sum + (parseInt(a.value) || 0), 0);
    } else if (typeof answers === 'object') {
      score = Object.values(answers).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
    }

    const maxScore = Array.isArray(questions)
      ? questions.reduce((sum, q) => {
          const maxVal = Math.max(...(q.options || []).map(o => o.value || 0));
          return sum + maxVal;
        }, 0)
      : 27;

    const { severity, isLow } = interpretScore(score, thresholds);

    const result = await prisma.testResult.create({
      data: {
        studentId,
        testId,
        score,
        maxScore,
        severity,
        isLow,
        answers: answers || {},
        sharedWithTherapist: shareWithTherapist ?? isLow,
        takenByName: takenByName || null,
        takenByUsername: takenByUsername || null,
        takenByPhone: takenByPhone || null,
      },
      include: { test: { select: { name: true, category: true, thresholds: true } } },
    });

    // Trigger alert if isLow
    if (isLow) {
      createAlertAndNotify({
        studentId,
        resultId: result.id,
        severity,
        testName: test.name,
        score,
        maxScore,
      }).catch(err => console.error('Alert error:', err));
    }

    res.status(201).json({ result, severity, isLow });
  } catch (err) {
    handleError(res, err, 'submitTest');
  }
}

// ── Results ───────────────────────────────────────────────────

async function getResults(req, res) {
  try {
    const { skip, take, page, limit } = parsePagination(req.query);
    const [results, total] = await Promise.all([
      prisma.testResult.findMany({
        where: { studentId: req.user.id },
        skip,
        take,
        orderBy: { takenAt: 'desc' },
        include: { test: { select: { name: true, category: true } } },
      }),
      prisma.testResult.count({ where: { studentId: req.user.id } }),
    ]);
    res.json({ results, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    handleError(res, err, 'getResults (student)');
  }
}

async function getResult(req, res) {
  try {
    const { id } = req.params;
    const result = await prisma.testResult.findFirst({
      where: { id, studentId: req.user.id },
      include: { test: true },
    });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ result });
  } catch (err) {
    handleError(res, err, 'getResult (student)');
  }
}

// ── Concerns ──────────────────────────────────────────────────

async function submitConcern(req, res) {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const concern = await prisma.concern.create({
      data: { studentId: req.user.id, message: message.trim() },
    });
    res.status(201).json({ concern });
  } catch (err) {
    handleError(res, err, 'submitConcern');
  }
}

async function getConcerns(req, res) {
  try {
    const concerns = await prisma.concern.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ concerns });
  } catch (err) {
    handleError(res, err, 'getConcerns');
  }
}

module.exports = { getDashboard, getTests, submitTest, getResults, getResult, submitConcern, getConcerns };
