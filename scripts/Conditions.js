class Conditions
{
    #faecherwahlManager
    #conditions = {}

    constructor(faecherwahlManager)
    {
        this.#faecherwahlManager = faecherwahlManager;

        this.#conditions.MatheNichtGenugNawi = faecher => !matheHatGenugNawi(faecher);
        this.#conditions.HatKeinNaWiB = faecher => !hatNaWiB(faecher);
        this.#conditions.HatKeinWahlfach = faecher => !hatEinWahlfach(faecher);
    }

    evaluate(condition)
    {
        return this.#conditions[condition](removeLowerNiveaus(sortiereFaecherNachNiveau(deepCopy(this.#faecherwahlManager.faecher))));
    }
}

function hatNaWiB(faecher)
{
    const nawi = faecher.filter(fach => isNaWi(fach));

    return fulfillsNiveaus(nawi, ['B']);
}

function hatEinWahlfach(faecher)
{
    return faecher.some(fach => fach.type === "wahl");
}

function matheHatGenugNawi(faecher)
{
    const nawi = faecher.filter(fach => isNaWi(fach));

    return fulfillsNiveaus(nawi, ['A', 'B', 'C']) ||
        fulfillsNiveaus(nawi, ['B', 'B', 'B']) ||
        fulfillsNiveaus(nawi, ['B', 'B', 'C', 'C']);
}

function fulfillsNiveaus(faecher, requiredNiveaus)
{
    const requireds = requiredNiveaus.map(numberFromNiveau);
    const niveaus = faecher.map(fach => numberFromNiveau(fach.niveau));

    return fulfillsNiveaus_impl(niveaus, requireds);
}

function fulfillsNiveaus_impl(niveaus, requireds)
{
    if (niveaus.length < requireds.length) return false;

    for (let i = 0; i < requireds.length; i++)
    {
        if (niveaus[i] < requireds[i]) return false;
    }
    return true;
}