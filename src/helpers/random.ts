export class Random {
    public static getRandomInt(minClusive, maxExclusive: number) {
        minClusive = Math.ceil(minClusive);
        maxExclusive = Math.floor(maxExclusive);
        return Math.floor(Math.random() * (maxExclusive - minClusive)) + minClusive;
    }
}
