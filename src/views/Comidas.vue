<template>
    <div>
        <h1>Comidas</h1>
        <form class="container form-editar" @submit.prevent="editarComida(comidaEditar)" v-if="editar">
            <h3>Editar Nota</h3>
            <article class="form-primeraParte">
                <div class="form-group primera-parte">
                    <label>Nombre</label>
                    <br />
                    <input type="text" v-model="comidaEditar.name" />
                </div>
                <div class="form-group primera-parte">
                    <label>Fecha de vencimiento</label>
                    <br />
                    <input type="text" v-model="comidaEditar.expires" />
                </div>
                <div class="form-group primera-parte">
                    <label>Peso por unidad</label>
                    <br />
                    <input type="text" v-model="comidaEditar.weightUnit.$numberDecimal" />
                </div>
            </article>
            <article class="form-segundaParte">
                <div class="form-group segunda-parte">
                    <label>Unidades por paquete</label>
                    <br />
                    <input type="text" v-model="comidaEditar.amountUnity" />
                </div>
                <div class="form-group segunda-parte">
                    <label for>Medida</label>
                    <br />
                    <input type="text" v-model="comidaEditar.medida" />
                </div>
            </article>
            <button class="btn bg-success button-accion" type="submit">Actualizar</button>
            <button class="btn bg-secondary button-accion" @click="editar = false">Cancelar</button>
        </form>
        <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">
            {{ mensaje.texto }}
        </b-alert>
        <br />
        <ul type="none" class="lista-crud">
            <li class="li-lista-crud" v-for="(item, index) in categoria" :key="index" @click="returnData(item.name)">
                {{ item.name }}
            </li>
            <li class="li-lista-crud" @click="returnData('Todos')">Todos</li>
        </ul>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Fecha de ingreso</th>
                    <th scope="col">Nombre del producto</th>
                    <th scope="col">Peso total</th>
                    <th scope="col">
                        Unidades
                        <br />
                        <small>por paquete</small>
                    </th>
                    <th scope="col">Empaques</th>
                    <th scope="col">Total de unidades</th>
                    <th scope="col">Fecha de vencimiento</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in comidas" :key="index">
                    <td>{{ formatearFecha(item.date) }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ totalPeso(item) }} {{ item.medida }}</td>
                    <td>{{ item.amountUnity }}</td>
                    <td>{{ packageQuantity(item) }}</td>
                    <td>
                        <button @click="subtractAmount(item, item._id)">-</button>
                        {{ item.totalUnit }}
                        <button @click="plusAmount(item, item._id)">+</button>
                    </td>
                    <td>{{ formatearFecha(item.expires) }}</td>
                    <td>
                        <button  @click="eliminarComida(item._id)" class="btn bg-danger button-accion">Eliminar</button>
                        <button  @click="activarEdicion(item._id)" class="btn bg-warning button-accion">Editar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editar: false,
                comidaEditar: {},
                state: 'default',
                comida: [],
                categoria: [],
                medida: [],
                tab: 'Todos',
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
            };
        },
        created() {
            this.listarComida();
            this.listarCategoria();
            this.listarMedida();
        },
        computed: {
            comidas() {
                switch (this.tab) {
                    case 'Lacteos':
                        return this.comida.filter((comida) => {
                            if (comida.category) {
                                return comida.category.name === 'Lacteos';
                            }
                            return false;
                        });
                        break;
                    case 'Carnes':
                        return this.comida.filter((comida) => {
                            if (comida.category) {
                                return comida.category.name === 'Carnes';
                            }
                            return false;
                        });
                        break;
                    case 'Secos':
                        return this.comida.filter((comida) => {
                            if (comida.category) {
                                return comida.category.name === 'Secos';
                            }
                            return false;
                        });
                        break;
                    case 'Liquidos':
                        return this.comida.filter((comida) => {
                            if (comida.category) {
                                return comida.category.name === 'Liquidos';
                            }
                            return false;
                        });
                        break;

                    default:
                        return this.comida;
                        break;
                }
            },
        },
        methods: {
            activarEdicion(_id) {
                this.editar = true;
                this.axios.get(`/comida/${_id}`).then((res) => {
                    this.comidaEditar = res.data;
                });
            },
            // Funcion para editar la comida
            editarComida(item) {
                this.axios.put(`/comida/${item._id}`, item).then((res) => {
                    const index = this.comida.findIndex((index) => index._id === this.comidaEditar._id);
                    if (this.comida[index].empaque == 'unidad') {
                        const diferencia = Number(this.comidaEditar.amountUnity) - Number(this.comida[index].amountUnity);
                        this.comida[index].totalUnit = Number(this.comida[index].totalUnit) + diferencia;
                        // console.log(diferencia, this.comida[index].totalUnit)
                    } else {
                        this.comida[index].totalUnit = Number(this.comida[index].totalUnit) + Number(this.comidaEditar.amountUnity);
                    }
                    this.comida[index].name = this.comidaEditar.name;
                    this.comida[index].expires = this.comidaEditar.expires;
                    this.comida[index].weightUnit.$numberDecimal = this.comidaEditar.weightUnit.$numberDecimal;
                    this.comida[index].amountUnity = this.comidaEditar.amountUnity;
                    this.comida[index].medida = this.comidaEditar.medida;
                    this.comidaEditar = {};
                });
                this.showAlert();
                this.mensaje.texto = 'Se actualizo correctamente';
                this.mensaje.color = 'success';
                this.editar = false;
            },
            returnData(nombre) {
                this.tab = nombre;
            },
            listarComida() {
                this.axios.get('/comida').then((response) => {
                    this.comida = response.data;
                });
            },
            listarCategoria() {
                this.axios.get('/categoria').then((response) => {
                    this.categoria = response.data;
                });
            },
            listarMedida() {
                this.axios.get('/medida').then((response) => {
                    this.medida = response.data;
                });
            },

            //Eliminar comida
            eliminarComida(_id) {
                alert('Estas seguro de eliminarlo?');
                this.axios.delete(`/comida/${_id}`).then((res) => {
                    const index = this.comida.findIndex((item) => item._id == res.data._id);
                    this.comida.splice(index, 1);
                    this.mensaje.color = 'success';
                    this.mensaje.texto = 'Se ha eliminado con exito';
                    this.showAlert();
                });
            },
            //Sube el total de unidades
            plusAmount(item, _id) {
                this.axios.put(`/comida/${_id}`, { totalUnit: item.totalUnit + 1 }).then((res) => {
                    item.totalUnit++;
                    if (item.empaque == 'unidad') {
                        this.sumarUnidad(item, item._id);
                    }
                });
            },
            //Baja el total de unidades
            subtractAmount(item, _id) {
                this.axios.put(`/comida/${_id}`, { totalUnit: item.totalUnit - 1 }).then((res) => {
                    item.totalUnit--;
                    if (item.empaque == 'unidad') {
                        this.restarUnidad(item, item._id);
                    }
                });
            },
            //En caso de unidades, si sube el total, sube la unidad
            sumarUnidad(item, _id) {
                this.axios.put(`/comida/${_id}`, { amountUnity: item.amountUnity + 1 }).then((res) => {
                    item.amountUnity++;
                });
            },
            //En caso de unidades, si baja el total, baja la unidad
            restarUnidad(item, _id) {
                this.axios.put(`/comida/${_id}`, { amountUnity: item.amountUnity - 1 }).then((res) => {
                    item.amountUnity--;
                });
            },

            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
            //Calcular la cantidad de paquetes
            packageQuantity(item) {
                if (item.empaque == 'caja') {
                    const totalPaquetes = item.totalUnit / item.amountUnity;
                    return Math.ceil(totalPaquetes);
                } else if (item.empaque == 'unidad') {
                    const paqueteUnidad = 0;
                    return paqueteUnidad;
                } else {
                    const totalPaquetePack = item.totalUnit / item.amountUnity;
                    return Math.ceil(totalPaquetePack);
                }
            },
            //Calcular el peso en total
            totalPeso(item) {
                const totalPeso = item.totalUnit * item.weightUnit.$numberDecimal;
                return totalPeso;
            },
            formatearFecha(fecha) {
                return new Date(fecha).toLocaleDateString();
            },
        },
    };
</script>

<style scoped>
    .lista-crud {
        display: flex;
        margin-inline-end: 0 !important;
    }
    .li-lista-crud {
        margin-right: 10px;
        border: 1px solid #454d55;
        border-bottom: 0;
        padding: 10px 10px 0px 10px;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #343a40;
        color: white;
        font-weight: bold;
    }
    ul {
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
    }
    .button-accion {
        color: white;
        margin-left: 5px;
    }

    .form-primeraParte {
        display: flex;
        justify-content: center;
    }
    .primera-parte {
        margin-left: 20px;
    }
    .form-segundaParte {
        display: flex;
        justify-content: center;
    }
    .segunda-parte {
        margin-left: 20px;
    }
    .form-editar {
        background-color: rgb(219, 231, 231);
        margin-top: 1em;
        width: 60%;
        border-radius: 8px;
    }
</style>
