<template>
    <div class="container-register">
        <h1>Registro</h1>
        <form @submit.prevent="nuevoUser(user)">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="form-control input-register" v-model="user.name"/>
            </div>
            <div class="form-group">
                <label>Apellido</label>
                <input type="text" class="form-control input-register" v-model="user.last_name"/>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control input-register" aria-describedby="emailHelp" v-model="user.email"/>
            </div>
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" class="form-control input-register" v-model="user.password" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user: {
                    name: '',
                    last_name: '',
                    email: '',
                    password: '',
                },
            }
        },
        methods: {
            nuevoUser(){
                this.axios.post('/register', this.user).then(res => {
                    this.user.name= '';
                    this.user.last_name= '';
                    this.user.email= '';
                    this.user.password= '';
                    this.user.push(res.data);
                    // console.log(this.user)

                })
                .catch((e) => {
                    console.log(e)
                })
            }
        }
    };
</script>

<style>
.container-register {
    width: 50%;
    margin: 0 auto;
}
.input-register {
    width: 50%;
    margin: 0 auto;
}
</style>
