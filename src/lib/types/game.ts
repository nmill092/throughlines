export type GameStatus =
    | 'playing'
    | 'submitting'
    | 'revealing-loss'
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