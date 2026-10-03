// Trösklar enligt spec 6.5. Körs lokalt, ingenting skickas.
export type RatingValues = { stress: number; sleep: number; recovery: number }

export const needsCareHint = ({ stress, sleep, recovery }: RatingValues) =>
  stress >= 9 || sleep <= 1 || recovery <= 1
