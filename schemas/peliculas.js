import z from 'zod';

const schemaPeli = z.object({
    title: z.string({
        invalid_type_error: 'El titulo debe ser string',
        required_error: 'El titulo es un campo requerido'
    }),
    year: z.number().int().min(1900).max(2027),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'La portada es invalida'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'El genero es obligatorio',
            invalid_type_error: 'El genero debe ser un array'
        }
    )
});

export function validarPeli(input){
    return schemaPeli.safeParse(input);
}

export function validarPeliculaParcialmente(input){
    return schemaPeli.partial().safeParse(input);
}