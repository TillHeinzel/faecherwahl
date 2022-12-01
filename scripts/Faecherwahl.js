
class FaecherwahlManager
{
    #display;
    #faecherBlocks = [];

    constructor()
    {
        this.#display = new GridDisplay(cartesianProduct(['obligatorisch', 'studienrichtung', 'wahl'], ['C', 'B', 'A']).map(([type, niveau]) => ({
            type: type,
            niveau: niveau,
            element: document.getElementById(type + ' ' + niveau),
        })));

        function cartesianProduct(...a)
        {
            return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
        }
    }

    get numberOfChoicesTaken() { return this.#faecherBlocks.length; }

    resetToLevel(level)
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
