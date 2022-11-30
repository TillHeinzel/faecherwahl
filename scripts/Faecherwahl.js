
class FaecherwahlManager
{
    #display;
    #faecherBlocks = [];

    constructor(display)
    {
        this.#display = display;
    }

    get numberOfChoicesTaken() { return this.#faecherBlocks.length; }

    removeAboveLevel(level)
    {
        this.#faecherBlocks.splice(level+1, this.#faecherBlocks.length);
    }

    push(faecher)
    {
        this.#faecherBlocks.push(faecher);
        this.#display.update(this.#flatfaecherBlocks);
    }

    contains(fach)
    {
        return this.#flatfaecherBlocks.some(e => e.fach === fach.fach && e.niveau === fach.niveau);
    }

    get faecher() { return this.#flatfaecherBlocks; }

    get #flatfaecherBlocks()
    {
        return this.#faecherBlocks.flat();
    }
}
