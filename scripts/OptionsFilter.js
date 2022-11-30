class OptionsFilter
{
    #faecherwahlManager;

    constructor(faecherwahlManager)
    {
        this.#faecherwahlManager = faecherwahlManager;
    }

    filterOptions(rawOptions)
    {
        return rawOptions.filter((option) =>
        {
            if (option.hasOwnProperty('dont-filter')) return true;

            if (isRawFach(option))
            {
                return this.#isValidFach(option);
            }

            if (isFaecher(option))
            {
                if (option.faecher.some(e => !this.#isValidFach(e)))
                    return false;

                return true;
            }

            return true;
        });
    }

    #isValidFach(fach)
    {
        if (this.#faecherwahlManager.contains(fach))
            return false;

        if (fach.niveau === 'C')
            return true;

        return this.#faecherwahlManager.contains(oneNiveauDown(fach));
    }

}

function oneNiveauDown(fach)
{
    if (fach.niveau === 'C')
        throw "niveau is C, cant get down from that";
    if (fach.niveau === 'B')
        return {
            'fach': fach.fach,
            niveau: 'C'
        };
    return {
        'fach': fach.fach,
        niveau: 'B'
    };

}
