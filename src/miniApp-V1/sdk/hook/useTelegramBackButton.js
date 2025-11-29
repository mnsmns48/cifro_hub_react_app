import { useEffect, useRef, useCallback } from "react";

export function useTelegramBackButton(
    tg,
    capsuleChoice,
    stack,
    setStack,
    setCapsuleChoice,
    featuresVisible // новый флаг
) {
    const stackRef = useRef(stack);
    const capsuleRef = useRef(capsuleChoice);

    useEffect(() => { stackRef.current = stack; }, [stack]);
    useEffect(() => { capsuleRef.current = capsuleChoice; }, [capsuleChoice]);

    const handler = useCallback(() => {
        const currentStack = stackRef.current;
        const currentCapsule = capsuleRef.current;

        if (!currentCapsule) return;

        if (currentStack.length > 0) {
            setStack(prev => prev.slice(0, -1));
        } else {
            setCapsuleChoice(null);
            tg?.BackButton?.hide();
        }
    }, [setStack, setCapsuleChoice, tg]);

    useEffect(() => {
        if (!tg?.BackButton) return;

        // если открыт Features → глобальный хук не активен
        if (featuresVisible) return;

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
    }, [tg, capsuleChoice, handler, featuresVisible]);

    useEffect(() => {
        tg?.BackButton?.hide();
    }, [tg]);
}
