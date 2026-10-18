import { useState } from 'react'
import { QUESTION_KIND_LABEL, type Quiz as QuizData } from '../course'
import { type Answers, type QuizResult, requiredCorrect } from '../course/quiz'
import { isPassed, submitQuiz, useProgress } from '../progress/store'
import { CheckMark, formatDate, useFocusWhen } from './common'

const LETTERS = 'ABCDE'

/**
 * Kunskapskontroll med automatisk rättning. Obegränsat antal försök, ingen tidsgräns.
 * Förklaringar visas efter rättning.
 */
export function Quiz({ quiz, theoryAnchor }: { quiz: QuizData; theoryAnchor: string }) {
  const progress = useProgress()
  const [answers, setAnswers] = useState<Answers>(() => quiz.questions.map(() => null))
  const [result, setResult] = useState<QuizResult | null>(null)
  const [missing, setMissing] = useState(0)
  const resultRef = useFocusWhen<HTMLDivElement>(result)
  const attempts = progress.chapters[quiz.chapterId]?.attempts ?? []
  const passedAt = progress.chapters[quiz.chapterId]?.passedAt
  const need = requiredCorrect(quiz)

  const choose = (qi: number, oi: number) => {
    if (result) return
    setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))
    setMissing(0)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const unanswered = answers.filter((a) => a === null).length
    if (unanswered) {
      setMissing(unanswered)
      return
    }
    setResult(submitQuiz(quiz, answers))
  }

  const retry = () => {
    setAnswers(quiz.questions.map(() => null))
    setResult(null)
    setMissing(0)
  }

  return (
    <div className="quiz">
      <p className="quiz-intro">
        {quiz.questions.length} frågor. Minst {need} rätta svar ({Math.round(quiz.passThreshold * 100)} %) krävs för
        godkänt. Ingen tidsgräns och obegränsat antal försök. Förklaringarna visas när kontrollen har rättats.
      </p>
      {isPassed(progress, quiz.chapterId) && passedAt && (
        <p className="quiz-status">
          <CheckMark label="Godkänd" /> Godkänd {formatDate(passedAt)}. Du kan göra om kontrollen när du vill; ett
          senare försök tar inte bort godkännandet.
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
              ? 'Underkapitlet är markerat som avklarat i kursnavigeringen. Läs förklaringarna nedan, även för de frågor du besvarade rätt.'
              : `Minst ${need} rätta svar krävs. Läs förklaringarna, repetera de delar av teorin som frågorna gäller och gör ett nytt försök.`}
          </p>
          <p className="quiz-actions">
            <button type="button" className="button" onClick={retry}>
              Gör om kontrollen
            </button>
            <a className="button button-secondary" href={`#${theoryAnchor}`}>
              Repetera teorin
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
                  </legend>
                  <ul className="quiz-options">
                    {q.options.map((o, oi) => {
                      const id = `${q.id}-${oi}`
                      const isCorrect = result && oi === q.correct
                      const isWrongChoice = result && oi === chosen && oi !== q.correct
                      return (
                        <li
                          key={oi}
                          className={`quiz-option ${chosen === oi ? 'is-chosen' : ''} ${isCorrect ? 'is-correct' : ''} ${
                            isWrongChoice ? 'is-wrong' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            id={id}
                            name={q.id}
                            checked={chosen === oi}
                            disabled={!!result}
                            onChange={() => choose(qi, oi)}
                          />
                          <label htmlFor={id}>
                            <span className="quiz-letter" aria-hidden="true">
                              {LETTERS[oi]}
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
                      <p className="quiz-verdict">{correct ? 'Rätt.' : chosen === null ? 'Obesvarad.' : 'Fel.'}</p>
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
                {missing === 1 ? 'En fråga är obesvarad.' : `${missing} frågor är obesvarade.`} Besvara alla frågor
                innan du rättar.
              </p>
            )}
            <button type="submit" className="button">
              Rätta kontrollen
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
