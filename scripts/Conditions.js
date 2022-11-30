class Conditions
{
    #faecherwahlManager
    #conditions = {}
        ;
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
    faecher = faecher.filter(fach => isNaWi(fach));

    return numberFromNiveau(faecher[0].niveau) >= numberFromNiveau('B');
}

function hatEinWahlfach(faecher)
{
    //console.log(faecher);
    const b = faecher.some(fach => fach.type === "wahl");
    //console.log(b);
    return b;
}

function matheHatGenugNawi(faecher)
{
    nawi = faecher.filter(fach => isNaWi(fach));

    return
        fulfillsNiveaus(nawi, ['A', 'B', 'C']) ||
        fulfillsNiveaus(nawi, ['B', 'B', 'B']) ||
        fulfillsNiveaus(nawi, ['B', 'B', 'C', 'C']);
}

function fulfillsNiveaus(faecher, requiredNiveaus)
{
    if (faecher.length < requiredNiveaus.length) return false;

    requiredNiveaus = requiredNiveaus.map(numberFromNiveau);
    const niveaus = faecher.map(fach => numberFromNiveau(fach.niveau)).splice(0, requiredNiveaus.length);

    console.log(niveaus);
    console.log(requiredNiveaus);

    const fulfills = niveaus.map((niveau, i) => niveau >= requiredNiveaus[i]);

    return fulfills.reduce((acc, current) => acc && current, true);
}
