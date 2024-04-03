import { useEffect, useState } from "react";

export interface ICidade {
    nome: string;
    codigo_ibge: string;
}

type UseCidadesArgs = {
    uf: string;
};

export const useCidades = ({ uf }: UseCidadesArgs) => {
    const [cidades, setCidades] = useState<ICidade[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!uf) return;

        setLoading(true);
        fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`)
            .then((response) => response.json())
            .then((data) => setCidades(data))
            .then(() => setLoading(false));
    }, [uf]);

    return {
        cidades,
        loading
    };
};