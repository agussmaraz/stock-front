<template>
    <div>
        <h1>Agregar un nuevo producto</h1>
        <b-alert :show="dismissCountDown" dismissible :variant="mensaje.color" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged">{{ mensaje.texto }}</b-alert>
        <div class="container">
            <form @submit.prevent="nuevaComida(comida)">
                <div class="form-group cajita-cant">
                    <label for="name">Nombre del producto</label>
                    <input type="text" class="form-control" id="name" v-model="comida.name" />
                </div>
                <article class="caja-medidas">
                    <div class="form-group cajita-cant">
                        <label for="medida">Medidas</label>
                        <br />
                        <select name="medida" v-model="comida.medida">
                            <option v-for="(item, index) in medida" :key="index" :value="item.name">{{ item.name }}</option>
                        </select>
                    </div>

                    <div class="form-group cajita-cant">
                        <label for="empaque">Empaque</label>
                        <br />
                        <select name="medida" v-model="comida.empaque">
                            <option v-for="(item, index) in empaques" :key="index" :value="item">{{ item }}</option>
                        </select>
                    </div>

                    <div class="form-group cajita-cant" v-if="comida.empaque !== 'unidad'">
                        <label for="cant-cajas">Cantidad de paquetes</label>
                        <input type="number" class="form-control" id="cant-cajas" v-model="comida.packageQuantity" />
                        <p v-if="comida.empaque !== 'caja'">El total de unidades es de: {{ dependePaquete }}</p>
                    </div>

                    <div class="form-group cajita-cant" v-if="comida.empaque == 'unidad' || comida.empaque == 'caja'">
                        <label for="cant-unidad">Cantidad de unidades</label>
                        <input type="number" class="form-control" id="cant-unidad" v-model="comida.amountUnity" />
                        <p v-if="comida.empaque !== 'unidad'">El total de unidades es de {{ totalUnidades }} unidades</p>
                    </div>
                    <div class="form-group cajita-cant">
                        <label for="peso-unidad">Peso por unidad</label>
                        <input type="text" class="form-control" id="peso-unidad" v-model.number="comida.weightUnit" />
                        <p v-if="comida.empaque === 'unidad'">El peso en total es de: {{ totalPesoUnidad }}</p>
                        <p v-else-if="comida.empaque === 'caja'">El peso en total es de: {{ totalPeso }}</p>
                        <p v-else>El total de peso es de {{ pesoSegunPack }}</p>
                    </div>
                    <div></div>
                </article>

                <div class="form-group">
                    <label for="category">Categoria</label>
                    <br />
                    <select name="category" v-model="comida.category">
                        <option v-for="(item, index) in categoria" :key="index" :value="item._id">{{ item.name }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="expires">Fecha de expiracion</label>
                    <input type="date" class="form-control" id="expires" v-model="comida.expires" />
                </div>

                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        computed: {
            empaques() {
                return this.comida && this.comida.medida ? this.medida.find((medida) => medida.name === this.comida.medida).empaque : [];
            },
            // Calculo para obtener el total de unidades
            totalUnidades() {
                const totalUnidades = this.comida.packageQuantity * this.comida.amountUnity;
                return totalUnidades;
            },
            // Calcular el peso de todas las unidades
            totalPeso() {
                const totalPeso = this.totalUnidades * this.comida.weightUnit;
                return totalPeso;
            },
            // Cuando selecciona 'unidad' devuelve el peso de cada unidad en total
            totalPesoUnidad() {
                const totalPesoUnidad = this.comida.amountUnity * this.comida.weightUnit;
                return totalPesoUnidad;
            },
            // Calcula el 'pack' que selecciona el usuario y te devuelve las unidades de cada pack
            dependePaquete() {
                if (this.comida.empaque == '12-pack') {
                    const unidades = 12;
                    const unidadPorPaquete = unidades * this.comida.packageQuantity;
                    return unidadPorPaquete;
                }
                if (this.comida.empaque == '6-pack') {
                    const unidad = 6;
                    const unidadPorPaquete2 = unidad * this.comida.packageQuantity;
                    return unidadPorPaquete2;
                }
                if (this.comida.empaque == '24-pack') {
                    const unidadDos = 24;
                    const unidadPorPaquete3 = unidadDos * this.comida.packageQuantity;
                    return unidadPorPaquete3;
                }
            },
            // Calcular el peso de los packs
            pesoSegunPack() {
                if (!this.dependePaquete) {
                    const paquetePorUnidad = 0;
                    return paquetePorUnidad;
                } else {
                    const pesoPack = this.dependePaquete * this.comida.weightUnit;
                    return pesoPack;
                }
            },
        },
        data() {
            return {
                comida: {
                    name: '',
                    expires: '',
                    category: '',
                    weightUnit: '',
                    amountUnity: '',
                    totalUnit: '',
                },
                dismissSecs: 5,
                dismissCountDown: 0,
                mensaje: { color: '', texto: '' },
                categoria: [],
                medida: [],
            };
        },
        created() {
            this.listarCategoria();
            this.listarMedida();
        },
        methods: {
            nuevaComida() {
                if (this.totalUnidades) {
                    this.comida.totalUnit = this.totalUnidades;
                } else if (this.dependePaquete) {
                    this.comida.amountUnity = this.dependePaquete / this.comida.packageQuantity;
                    this.comida.totalUnit = this.dependePaquete;
                } else if (!this.comida.packageQuantity) {
                    this.comida.totalUnit = this.comida.amountUnity;
                }

                // let fecha = new Date(this.comida.expires);
                // fecha = fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate();
                // this.comida.expires = fecha;
                this.axios
                    .post('/comida-nueva', this.comida)
                    .then((res) => {
                        // console.log(res.data);
                        this.comida.name = '';
                        this.comida.amountUnity = '';
                        this.comida.weightUnit = '';
                        this.comida.expires = '';
                        this.comida.category = '';
                        this.comida.push(res.data);
                        //Alerta
                        this.mensaje.texto = 'Fue agregado con exito';
                        this.mensaje.color = 'success';
                        this.showAlert();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            listarMedida() {
                this.axios.get('/medida').then((response) => {
                    this.medida = response.data;
                });
            },
            listarCategoria() {
                this.axios.get('/categoria').then((response) => {
                    this.categoria = response.data;
                });
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown;
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs;
            },
        },
    };
</script>

<style>
    .caja-medidas {
        display: flex;
        justify-content: center;
    }
    .cajita-cant {
        margin-left: 20px;
    }
</style>
