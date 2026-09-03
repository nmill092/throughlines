export type ToastMessage = {
  id: string;
  text: string;
};

let lastId: string | null = null; 

export const correctMessages: ToastMessage[] = [
  { id: 'correct-nice', text: 'Nice!' },
  { id: 'correct-got-it', text: 'Got it!' },
  { id: 'correct-got-em', text: 'Got \'em!' },
  { id: 'correct-groovy', text: 'Groovy!' },
  { id: 'correct-awesome', text: 'Awesome!' },
  { id: 'correct-sweet', text: 'Sweet!' },
  { id: 'correct-spirit', text: 'That\'s the spirit!' },
  { id: 'correct-lit', text: 'Lit!' },
  { id: 'correct-legitness', text: 'Legitness!' },
  { id: 'correct-thats-it', text: 'That\'s it!' },
  { id: 'correct-you-got-it', text: 'You got it!' },
  { id: 'correct-tres-bien', text: 'Très bien!' },
  { id: 'correct-que-chulo', text: '¡Qué chulo!' },
  { id: 'correct-smarty-pants', text: 'Smarty pants!' },
  { id: 'correct-capital', text: 'Capital!' },
  { id: 'correct-copacetic', text: 'Copacetic!' }
];

export const incorrectMessages: ToastMessage[] = [
  { id: 'incorrect-nah', text: 'Nah...' },
  { id: 'incorrect-not-quite', text: 'Not quite...' },
  { id: 'incorrect-try-again', text: 'Try again...' },
  { id: 'incorrect-nope', text: 'Nope!' },
  { id: 'incorrect-hmm', text: 'Hmm...' },
  { id: 'incorrect-not-quite-right', text: 'That\'s not quite right...' },
  { id: 'incorrect-swing-and-a-miss', text: 'Swing and a miss!' },
  { id: 'incorrect-oof', text: 'Oof!' },
  { id: 'incorrect-no-cigar', text: 'Close, but no cigar...' },
  { id: 'incorrect-guess-again', text: 'Guess again!' }
];

export const oneAwayMessage: ToastMessage = { id: 'one-away', text: 'One away!' };

export const pickMessage = (list: ToastMessage[]): ToastMessage => {
  const randomToast = list[Math.floor(Math.random() * list.length)];
  if (randomToast.id === lastId && list.length > 1) { 
    return pickMessage(list); 
  }
  lastId = randomToast.id; 
  return randomToast; 
}