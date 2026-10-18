import { useState } from 'react'
import { QUESTION_KIND_LABEL, type Quiz as QuizData } from '../course'
import { type Answers, type QuizResult } from '../course/quiz'
import { isPassed, submitQuiz, useProgress } from '../progress/store'
import { CheckMark, formatDate, useFocusWhen } from './common'

const LETTERS = 'ABCDE'

/** Slumpad ordning för en frågas alternativ (Fisher–Yates). Alternativen behåller sina index, så rättningen påverkas inte. */
function shuffledOrder(n: number) {
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/**
 * Självtest med automatisk rättning. Obegränsat antal försök, ingen tidsgräns.
 * Förklaringar visas efter rättning.
 */
export function Quiz({ quiz, theoryAnchor }: { quiz: QuizData; theoryAnchor: string }) {
  const progress = useProgress()
  const [answers, setAnswers] = useState<Answers>(() => quiz.questions.map(() => null))
  const [result, setResult] = useState<QuizResult | null>(null)
  const [missing, setMissing] = useState(0)
  // Ny ordning på alternativen vid varje försök, så att man inte lär sig positioner i stället för innehåll.
  const newOrders = () => quiz.questions.map((q) => shuffledOrder(q.options.length))
  const [orders, setOrders] = useState<number[][]>(newOrders)
  const resultRef = useFocusWhen<HTMLDivElement>(result)
  const attempts = progress.chapters[quiz.chapterId]?.attempts ?? []
  const passedAt = progress.chapters[quiz.chapterId]?.passedAt

  const choose = (qi: number, oi: number) => {
    if (result) return
    const multiple = quiz.questions[qi].multiple
    setAnswers((a) =>
      a.map((v, i) => {
        if (i !== qi) return v
        if (!multiple) return [oi]
        const cur = v ?? []
        return cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi]
      }),
    )
    setMissing(0)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const unanswered = answers.filter((a) => !a || a.length === 0).length
    if (unanswered) {
      setMissing(unanswered)
      return
    }
    setResult(submitQuiz(quiz, answers))
  }

  const retry = () => {
    setAnswers(quiz.questions.map(() => null))
    setOrders(newOrders())
    setResult(null)
    setMissing(0)
  }

  return (
    <div className="quiz">
      <p className="quiz-intro">
        {quiz.questions.length} frågor.{' '}
        {quiz.questions.some((q) => q.multiple) &&
          'Vissa frågor har flera rätta svar. De har kryssrutor, och alla rätta alternativ måste väljas. '}
        Efter rättningen får du en förklaring till varje fråga. Testet kan göras om hur många gånger som helst.
      </p>
      {isPassed(progress, quiz.chapterId) && passedAt && (
        <p className="quiz-status">
          <CheckMark label="Godkänd" /> Godkänd {formatDate(passedAt)}. Ett senare försök tar inte bort godkännandet.
        </p>
      )}

      {result && (
        <div className="quiz-result" ref={resultRef} tabIndex={-1} role="status">
          <p className="quiz-result-score">
            {result.correct} av {result.total} rätt ({Math.round(result.score * 100)} %).{' '}
            <strong>{result.passed ? 'Godkänt.' : 'Inte godkänt.'}</strong>
          </p>
          <p>
            {result.passed
              ? 'Kapitlet är markerat som klart i kursnavigeringen.'
              : 'Läs förklaringarna nedan och försök igen.'}
          </p>
          <p className="quiz-actions">
            <button type="button" className="button" onClick={retry}>
              Gör om testet
            </button>
            <a className="button button-secondary" href={`#${theoryAnchor}`}>
              Läs texten igen
            </a>
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <ol className="quiz-questions">
          {quiz.questions.map((q, qi) => {
            const chosen = answers[qi]
            const correct = result?.perQuestion[qi]
            return (
              <li key={q.id} className="quiz-question">
                <fieldset>
                  <legend>
                    <span className="quiz-kind">
                      Fråga {qi + 1} · {QUESTION_KIND_LABEL[q.kind]}
                    </span>
                    <span className="quiz-prompt" dangerouslySetInnerHTML={{ __html: q.prompt }} />
                    {q.multiple && <span className="quiz-multiple">Flera alternativ kan vara rätt. Välj alla som stämmer.</span>}
                  </legend>
                  <ul className="quiz-options">
                    {orders[qi].map((oi, pos) => {
                      const o = q.options[oi]
                      const id = `${q.id}-${oi}`
                      const picked = !!chosen?.includes(oi)
                      const isCorrect = result && q.correct.includes(oi)
                      const isWrongChoice = result && picked && !q.correct.includes(oi)
                      return (
                        <li
                          key={oi}
                          className={`quiz-option ${picked ? 'is-chosen' : ''} ${isCorrect ? 'is-correct' : ''} ${
                            isWrongChoice ? 'is-wrong' : ''
                          }`}
                        >
                          <input
                            type={q.multiple ? 'checkbox' : 'radio'}
                            id={id}
                            name={q.id}
                            checked={picked}
                            disabled={!!result}
                            onChange={() => choose(qi, oi)}
                          />
                          <label htmlFor={id}>
                            <span className="quiz-letter" aria-hidden="true">
                              {LETTERS[pos]}
                            </span>
                            <span className="quiz-text" dangerouslySetInnerHTML={{ __html: o }} />
                            {isCorrect && <span className="quiz-tag">Rätt svar</span>}
                            {isWrongChoice && <span className="quiz-tag">Ditt svar</span>}
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                  {result && (
                    <div className="quiz-explanation">
                      <p className="quiz-verdict">{correct ? 'Rätt.' : !chosen?.length ? 'Obesvarad.' : 'Fel.'}</p>
                      <p dangerouslySetInnerHTML={{ __html: q.explanation }} />
                    </div>
                  )}
                </fieldset>
              </li>
            )
          })}
        </ol>
        {!result && (
          <div className="quiz-submit">
            {missing > 0 && (
              <p className="quiz-missing" role="alert">
                {missing === 1 ? 'En fråga är obesvarad.' : `${missing} frågor är obesvarade.`} Svara på alla frågor
                innan du rättar.
              </p>
            )}
            <button type="submit" className="button">
              Rätta testet
            </button>
          </div>
        )}
      </form>

      {attempts.length > 0 && (
        <details className="quiz-history">
          <summary>Tidigare försök ({attempts.length})</summary>
          <ul>
            {attempts
              .slice()
              .reverse()
              .map((a) => (
                <li key={a.at}>
                  {formatDate(a.at, true)}: {a.correct} av {a.total} rätt, {a.passed ? 'godkänt' : 'inte godkänt'}
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  )
}
