// src/components/jocs-economics/screens/Result.tsx
import type { PublicQuestion, AnswerResult } from '../../../lib/jocs-economics/client/types';

interface Props {
  question: PublicQuestion;
  result: AnswerResult;
  selectedOptionIdx: number;
}

export function Result({ question, result, selectedOptionIdx }: Props) {
  const { isCorrect, correctIdx, scoreGain, explicacion } = result;
  return (
    <>
      <h2
        class="jocs-title"
        style={{
          fontSize: 32,
          textAlign: 'center',
          color: isCorrect ? 'var(--jocs-pine)' : '#9C3A1C',
          margin: '32px 0 8px',
        }}
      >
        {isCorrect ? '¡Acierto!' : 'Fallaste'}
      </h2>
      <p style={{ textAlign: 'center', fontSize: 18, margin: '0 0 24px', fontFamily: 'JetBrains Mono, monospace' }}>
        {isCorrect ? `+${scoreGain} puntos` : '−1 vida'}
      </p>

      <p class="jocs-enunciado">{question.enunciado || question.id}</p>

      {question.opciones.map((opt, i) => {
        const isCorrectOpt = i === correctIdx;
        const isSelected = i === selectedOptionIdx;
        let className = 'jocs-option disabled';
        if (isCorrectOpt) className += ' correct';
        else if (isSelected) className += ' wrong';
        return (
          <div key={i} class={className} data-opt={i}>
            <span class="letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
          </div>
        );
      })}

      {explicacion && (
        <p class="jocs-mute" style={{ marginTop: 20, fontStyle: 'italic', fontFamily: 'Fraunces, serif', fontSize: 14 }}>
          {explicacion}
        </p>
      )}
    </>
  );
}
