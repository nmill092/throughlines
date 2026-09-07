export type GameStatus =
    | 'playing'
    | 'submitting'
    | 'revealing-loss'
    | 'celebrating-win'
    | 'won'
    | 'lost';

  export type AnimationPhase = 
    | 'intro'
    | 'celebrating'
    | 'gathering'
    | 'fusing'
    | 'shaking'
    | 'shuffling'
    | null;