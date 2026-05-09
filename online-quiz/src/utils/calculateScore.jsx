export default function calculateScore(questions, answers, sahi=4, wrong=-1){
let score = 0, correct = 0, incorrect = 0;
questions.forEach(q => {
const given = answers[q.id];
if(!given) return;
if(given === q.correctChoiceId){ score += sahi; correct++; }
else { score += wrong; incorrect++; }
});
return { score, correct, incorrect };
}