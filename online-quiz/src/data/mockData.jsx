import { v4 as uuidv4 } from 'uuid';
const sampleQuizzes = [
    {
        id: 'quiz-1',
        title: 'Basic Math',
        sahi: 4,
        wrong: -1,
        total: 3,
        published: true,
        timeLimitMinutes: 10,
        createdAt: Date.now(),
    },
    {
        id: 'quiz-2',
        title: 'General Knowledge',
        sahi: 4,
        wrong: -1,
        total: 3,
        published: true,
        timeLimitMinutes: 10,
        createdAt: Date.now(),
    }
];


const sampleQuestions = [
    {
        id: uuidv4(),
        quizId: 'quiz-1',
        text: '2 + 2 = ?',
        choices: [{ id: 'A', text: '3' }, { id: 'B', text: '4' }, { id: 'C', text: '5' }],
        correctChoiceId: 'B',
        sn: 1
    },
    {
        id: uuidv4(),
        quizId: 'quiz-1',
        text: '5 * 3 = ?',
        choices: [{ id: 'A', text: '15' }, { id: 'B', text: '10' }, { id: 'C', text: '8' }],
        correctChoiceId: 'A',
        sn: 2
    },
    {
        id: uuidv4(),
        quizId: 'quiz-2',
        text: 'Capital of France?',
        choices: [{ id: 'A', text: 'Berlin' }, { id: 'B', text: 'Madrid' }, { id: 'C', text: 'Paris' }],
        correctChoiceId: 'C',
        sn: 1
    }
];


export { sampleQuizzes, sampleQuestions };