const makeTimer = range => {
    // range is an object with minSeconds and maxSeconds properties
    const { minSeconds, maxSeconds } = range;
    // Generate a random number of seconds between minSeconds and maxSeconds
    const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds);
    return () => new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, randomSeconds * 1000); // Convert seconds to milliseconds
    });
}

// Create a timer that will resolve after 1 to 3 seconds
const waitForShortTime = makeTimer({ minSeconds: 1, maxSeconds: 3 });
// Create a timer that will resolve after 1 to 5 seconds
const waitForLongTime = makeTimer({ minSeconds: 5, maxSeconds: 10 });
// just return short random time in miliseconds
const shortTime = () => Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
// just return long random time in miliseconds
const longTime = () => Math.floor(Math.random() * (10000 - 5000 + 1) + 5000);

export { shortTime, longTime };
