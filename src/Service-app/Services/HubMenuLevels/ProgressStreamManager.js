class ProgressStreamManager {
    constructor() {
        this.streams = new Map();
        this.subscribers = new Map();
        this.totals = new Map();
        this.counts = new Map();
    }

    subscribe(progress_obj, callback) {
        if (!this.subscribers.has(progress_obj)) {
            this.subscribers.set(progress_obj, new Set());
        }

        const subs = this.subscribers.get(progress_obj);
        if (subs.has(callback)) return;

        subs.add(callback);

        if (!this.streams.has(progress_obj)) {
            this._startStream(progress_obj);
        }
    }


    unsubscribe(progress_obj, callback) {
        const subs = this.subscribers.get(progress_obj);
        if (subs) {
            subs.delete(callback);
            if (subs.size === 0) {
                this._stopStream(progress_obj);
            }
        }
    }

    _startStream(progress_obj) {
        const es = new EventSource(`/progress/${progress_obj}`);
        this.streams.set(progress_obj, es);
        this.totals.set(progress_obj, 0);
        this.counts.set(progress_obj, 0);

        es.onmessage = (event) => {
            const data = event.data.trim();

            if (data.startsWith("data: COUNT=")) {
                const count = parseInt(data.split("=")[1], 10);
                this.totals.set(progress_obj, count);
                this._notify(progress_obj, { status: "in_progress", percent: 0 });
                return;
            }

            const current = this.counts.get(progress_obj) + 1;
            this.counts.set(progress_obj, current);

            const total = this.totals.get(progress_obj);
            if (total > 0) {
                const percent = Math.min(Math.round((current / total) * 100), 100);
                this._notify(progress_obj, { status: "in_progress", percent });
            }

            if (data.includes("END")) {
                es.close();
                this.streams.delete(progress_obj);
                this._notify(progress_obj, { status: "done", percent: 100 });
            }
        };
    }

    _stopStream(progress_obj) {
        const es = this.streams.get(progress_obj);
        if (es) {
            es.close();
            this.streams.delete(progress_obj);
        }
        this.subscribers.delete(progress_obj);
        this.totals.delete(progress_obj);
        this.counts.delete(progress_obj);
    }

    _notify(progress_obj, state) {
        const subs = this.subscribers.get(progress_obj);
        if (subs) {
            subs.forEach((cb) => cb(state));
        }
    }
}

export const progressStreamManager = new ProgressStreamManager();
