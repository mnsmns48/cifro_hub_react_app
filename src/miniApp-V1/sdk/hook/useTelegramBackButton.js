import { useEffect, useRef, useCallback } from "react";

export function useTelegramBackButton(tg, capsuleChoice, stack, setStack, setCapsuleChoice) {
    const stackRef = useRef(stack);
    const capsuleRef = useRef(capsuleChoice);

    // обновляем refs на каждое изменение
    useEffect(() => { stackRef.current = stack; }, [stack]);
    useEffect(() => { capsuleRef.current = capsuleChoice; }, [capsuleChoice]);

    // стабильный обработчик
    const handler = useCallback(() => {
        const currentStack = stackRef.current;
        const currentCapsule = capsuleRef.current;

        if (!currentCapsule) return;

        if (currentStack.length > 0) {
            // шаг назад по stack
            setStack(prev => prev.slice(0, -1));
        } else {
            // выход из capsuleChoice
            setCapsuleChoice(null);
            tg?.BackButton?.hide();
        }
    }, [setStack, setCapsuleChoice, tg]);

    // навешиваем обработчик и управляем показом кнопки
    useEffect(() => {
        if (!tg?.BackButton) return;

        // очистка старых обработчиков
        tg.BackButton.offClick?.(handler);

        if (capsuleChoice) {
            tg.BackButton.show();
            tg.BackButton.onClick(handler);
        } else {
            tg.BackButton.hide();
        }

        return () => {
            tg.BackButton.offClick?.(handler);
        };
    }, [tg, capsuleChoice, handler]);

    // гарантированно скрываем кнопку при первом монтировании
    useEffect(() => {
        tg?.BackButton?.hide();
    }, [tg]);
}
