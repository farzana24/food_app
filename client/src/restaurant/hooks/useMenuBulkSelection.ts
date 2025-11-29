import { useCallback, useState } from "react";

export function useMenuBulkSelection(initial: string[] = []) {
    const [selectedIds, setSelectedIds] = useState(new Set(initial));

    const toggle = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const reset = useCallback(() => setSelectedIds(new Set()), []);

    const bulkSet = useCallback((ids: string[], checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => {
                if (checked) next.add(id);
                else next.delete(id);
            });
            return next;
        });
    }, []);

    return {
        selectedIds,
        toggle,
        reset,
        bulkSet,
        isSelected: (id: string) => selectedIds.has(id),
    };
}
