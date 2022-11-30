
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
