
class GridDisplay
{
    constructor(combinationsWithElements)
    {
        this.combinations = combinationsWithElements;
    }

    update(faecher)
    {
        this.#doUpdate(JSON.parse(JSON.stringify(faecher)));
    }

    #doUpdate(faecher)
    {
        this.combinations.forEach((c) => c.faecher = faecher.filter((f) => f.niveau === c.niveau && f.type === c.type));

        this.combinations.forEach((combination, index) =>
        {

            const later = this.combinations.slice(index + 1, this.combinations.length).map((c) => c.faecher).flat().map((f) => f.fach);

            combination.faecher.filter((f) => later.includes(f.fach)).forEach((f) => f.strike = true);
        });

        this.combinations.forEach(({
            faecher,
            element
        }) => this.#updateElement(faecher, element));
    }

    #updateElement(faecher, element)
    {
        element.innerHTML = stringifyFaecherList(faecher);
    }
}

function stringifyFaecherList(faecher)
{
    // console.log(faecher);
    return faecher.map(stringifyFach).join('<br>');
}

function stringifyFach(fach)
{
    const text = '- ' + fach.fach + ' ' + fach.niveau;
    if (fach.hasOwnProperty('strike'))
        return '<s>' + text + '</s>';
    return text;
}
