
function isRawFach(option)
{
    return option.hasOwnProperty('fach') && option.hasOwnProperty('niveau');
}

function isFaecher(option)
{
    return option.hasOwnProperty('faecher');
}

function stringFromFach(fach)
{
    return fach.fach + ' ' + fach.niveau;
}

function stringFromFaecher(faecher)
{
    return faecher.map(stringFromFach).join(' und ');
}

function faecherFromOption(option)
{
    if (isRawFach(option)) return [option];

    if (isFaecher(option)) return option.faecher;

    return [];
}

function numberFromNiveau(niveau)
{
    if (niveau === 'A') return 3;
    if (niveau === 'B') return 2;
    if (niveau === 'C') return 1;
    return 0;
}

const NawiFaecher =
    [
        "Physik",
        "Naturgeografie",
        "Biologie",
        "Chemie"
    ];

function isNaWi(fach)
{
    return NawiFaecher.includes(fach.fach);
}

function compareStrings(s1, s2)
{
    return s1.localeCompare(s2);
}

function selbesFach(fach1, fach2)
{
    return fach1.fach === fach2.fach;
}
function selbesNiveau(fach1, fach2)
{
    return fach1.niveau === fach2.niveau;
}

function sortiereFaecherNachNiveau(faecher)
{
    faecher.sort((f1, f2) =>
    {
        return selbesNiveau(f1, f2) ? compareStrings(f1.fach, f2.fach) : compareStrings(f1.niveau, f2.niveau);
    });
    return faecher;
}

function removeLowerNiveaus(faecher)
{
    return faecher.filter(function (item, pos)
    {
        return faecher.findIndex(e => e.fach === item.fach) == pos;
    })
}

