function calculateStreak(completedDates) {

    if (!completedDates || completedDates.length === 0) {

        return {
            currentStreak: 0,
            bestStreak: 0
        };

    }

    // Dates are already stored as YYYY-MM-DD strings
    const dates = [...completedDates].sort();

    let currentStreak = 1;
    let bestStreak = 1;

    for (let i = 1; i < dates.length; i++) {

        const previous = new Date(dates[i - 1]);
        const current = new Date(dates[i]);

        const diff =
            (current - previous) /
            (1000 * 60 * 60 * 24);

        if (diff === 1) {

            currentStreak++;

        } else {

            currentStreak = 1;

        }

        if (currentStreak > bestStreak) {

            bestStreak = currentStreak;

        }

    }

    return {

        currentStreak,

        bestStreak

    };

}

module.exports = calculateStreak;