export class CacheKeyUtil {
    static generate(
        prefix: string,
        path: string,
        query: Record<string, any>,
    ): string {
        const sortedQuery = Object.keys(query)
            .sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            })
            .reduce((acc, key) => {
                const val = query[key];
                if (val === null || val === undefined || val === '') return acc;
                const strVal = Array.isArray(val)
                    ? [...val]
                        .sort((a, b) => {
                            const sa = String(a),
                                sb = String(b);
                            if (sa < sb) return -1;
                            if (sa > sb) return 1;
                            return 0;
                        })
                        .join(',')
                    : String(val);
                acc.push(`${key}=${strVal}`);
                return acc;
            }, [] as string[])
            .join('&');
        return [prefix, path, sortedQuery].filter(Boolean).join(':');
    }
}
