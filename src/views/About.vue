<template>
    <div class="container">
        <h1>Consumos</h1>
        <div>
            <ul type="none" class="lista-crud2">
                <li class="li-lista-estadisticas" v-for="(item, index) in categoria" :key="index" @click="returnData(item.name)">{{ item.name }}</li>
                <li class="li-lista-estadisticas" @click="returnData('Todos')">Todos</li>
            </ul>
        </div>
        <hr />
        <article class="div-esquema">
            <div class="lista-comida" v-if="listaComida">
                <ul class="list-group list-group-item-action listaComidaEstadistica">
                    <li class="list-group-item list-group-item-action" v-for="(item, index) in comidas" :key="index" @click="activarEsquema(item._id)">{{ item.name }}</li>
                </ul>
            </div>
            <div>
                <area-chart :data="movimientos" download="grafico"  v-if="esquema" width="700px"></area-chart>
            </div>
        </article>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                esquema: false,
                movimientos: {},
                tab: 'Todos',
                comida: [],
                categoria: [],
                buscarMovimientos: {},
                listaComida: false,
            };
        },
        created() {
            // this.listarMovimiento(),
            this.listarComida(), this.listarCategoria();
        },
        methods: {
            activarEsquema(_id) {
                this.esquema = true;
                this.buscarMovimiento(_id);
                this.movimientos = {};
                // console.log(_id);
            },
            salirEsquema() {
                this.esquema = false;
            },
            returnData(nombre) {
                this.tab = nombre;
                this.listaComida = true;
            },
            listarCategoria() {
                this.axios.get('/categoria').then((response) => {
                    this.categoria = response.data;
                });
            },
            listarComida() {
                this.axios.get('/comida').then((response) => {
                    this.comida = response.data;
                    // console.log(this.comida)
                });
            },
            //Realizando esquema de cada comida
            buscarMovimiento(_id) {
                this.axios.get(`/movimientoComida/${_id}`).then((response) => {
                    // Traemos los movimientos segund id
                    this.buscarMovimientos = response.data;
                    // console.log(this.movimientos)
                    // ForEach para imprimir los movimientos uno por uno
                    this.buscarMovimientos.forEach((movimiento) => {
                        //Creamos la fecha de cada movimiento
                        let fecha = new Date(movimiento.date);
                        fecha = fecha.getFullYear() + '-' + fecha.getMonth() + '-' + fecha.getDate();

                        // Seteamos la fecha anterior de cada movimiento
                        let fecha_anterior = new Date(movimiento.date);
                        fecha_anterior.setDate(fecha_anterior.getDate() - 1);
                        fecha_anterior = fecha_anterior.getFullYear() + '-' + fecha_anterior.getMonth() + '-' + fecha_anterior.getDate();
                        // console.log(fecha_anterior);
                        // Guardamos el valor de cada movimiento
                        let amount = movimiento.valor;
                        // Si la accion del movimiento fue la creacion entonces lo guardamos normal en la posicion fecha de this.movimientos que solo se guarda en el front
                        if (movimiento.accion === 'creado') {
                            this.$set(this.movimientos, fecha, amount);
                        }
                        // // Si la accion es suma
                        if (movimiento.accion == 'suma') {
                            // y ya existia la posicion fecha en this.movimientos le sumamos el nuevo amount que seria la suma del dia
                            if (this.movimientos[fecha]) {
                                this.$set(this.movimientos, fecha, this.movimientos[fecha] + Number(amount));
                            } else {
                                // Si existe una fecha anterior significa que es un nuevo dia entonces le sumamos al total anterior
                                this.$set(this.movimientos, fecha, (this.movimientos[fecha_anterior] ? this.movimientos[fecha_anterior] : this.movimientos[fecha]) + Number(amount));
                            }
                            //     // si la accion es resta
                        } else if (movimiento.accion == 'resta') {
                            // seteamos en this movimientos la posicion fecha, la resta del amount del total del dia
                            if (this.movimientos[fecha]) {
                                this.$set(this.movimientos, fecha, this.movimientos[fecha] - amount);
                            } else {
                                // si existe total anterior significa que es un dia diferente, entonces le sumamos al total anterior
                                this.$set(this.movimientos, fecha, (this.movimientos[fecha_anterior] ? this.movimientos[fecha_anterior] : this.movimientos[fecha]) - amount);
                            }
                        }
                        // console.log(this.movimientos);
                    });
                });
            },
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
    };
</script>

<style>
    .lista-crud2 {
        display: flex;
        margin-inline-end: 0 !important;
        justify-content: center;
        margin-top: 2em;
    }
    .li-lista-estadisticas {
        margin-left: 20px;
        border: solid cadetblue;
        border-radius: 8px;
        padding: 8px;
        color: white;
        background-color: cadetblue;
    }
    .listaComidaEstadistica {
        overflow-y: scroll;
        height: 200px;
    }
    .lista-comida {
        width: 150px;
    }
    .div-esquema {
        display: flex;
        justify-content: space-around;
    }
</style>
