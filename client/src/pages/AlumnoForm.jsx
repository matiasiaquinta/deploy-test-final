import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input, Label } from "../components/ui";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAlumnos } from "../context/AlumnosContext";

dayjs.extend(utc);

export function AlumnoForm() {
    const { createAlumno, getAlumno, updateAlumno } = useAlumnos();
    const navigate = useNavigate();
    const params = useParams();
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    /*
    params devuelve un objeto con los valores del alumno

    useEffect(() => {
        console.log(params);
    }, []);*/

    useEffect(() => {
        const loadAlumno = async () => {
            if (params.id) {
                const alumno = await getAlumno(params.id);
                setValue("nombre", alumno.nombre);
                console.log(alumno);
                //demas valores
                //setValue("completed", alumno.completed)
            }
        };
        loadAlumno();
    }, []);

    //const onSubmit = async (data) => {
    //    if (params.id) {
    //        updateAlumno(params.id, data);
    //    } else {
    //        createAlumno(data);
    //    }
    //    navigate("/alumnos");
    //};

    const onSubmit = async (data) => {
        try {
            if (params.id) {
                updateAlumno(params.id, {
                    ...data,
                    date: dayjs.utc(data.date).format(),
                });
            } else {
                createAlumno({
                    ...data,
                    date: dayjs.utc(data.date).format(),
                });
            }

            // navigate("/alumnos")
        } catch (error) {
            console.log(error);
        }
    };

    /*

        Para entender:
        El ...register devuelve:
        - onChange
        - value
        - name
        setValue() -> voy guardando
 
    */

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    {...register("nombre")}
                    autoFocus
                />
                {errors.nombre && (
                    <p className="text-red-500 text-xs italic">
                        Por favor ingrese un nombre
                    </p>
                )}

                {/* agregar aca el resto de datos de la tabla (crear tabla) nombre, deporte, precio...*/}
                <Button>Guardar</Button>
            </form>
        </Card>
    );
}
