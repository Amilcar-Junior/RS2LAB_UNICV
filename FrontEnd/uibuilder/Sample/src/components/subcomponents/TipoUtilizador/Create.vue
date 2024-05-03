<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Adicionar Tipo Utilizador</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
            <label for="">Nome</label>
            <input type="text" v-model="model.item.Nome" class="form-control" />
        </div>
        <div class="mb-3">
            <label for="">Descrição</label>
            <input type="text" v-model="model.item.Descricao"  class="form-control" />
        </div>
        <div class="mb-3">
            <button type="button" @click="addTipoUtilizador" class="btn btn-primary float-right">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
    data() {
        return {
            model: {
                item : {
                    Nome: '',
                    Descricao: '',
                }
            }
        };
    },
    mounted(){
        
    },
    methods: {
        
        
        addTipoUtilizador(){
            var self = this;                          //Assign this to a variable         
            // this.form.type = this.selected;           //Assigns selected to form.type
            var param = {                             //Create the JSon
                   "Nome": this.model.item.Nome,
                   "Descricao": this.model.item.Descricao,   
            }
            axios.post('/tuts/addtipoutilizador',param)
            .then(resp=>{ 
                console.log(resp)
                self.showNotification(); //shows notification of successful add
            })
            .catch(e=>{ console.log(error); });
        },
        //Use to clean form upon succcessful insert
        cleanForm(){
            this.model.Nome = '';
            this.model.Descricao = '';
        },
        //Shows a dialog notification
        showNotification() {
            var self = this;  //Assign this to a variable   
            this.boxTwo = ''
            this.$bvModal.msgBoxOk('Data was submitted successfully', {
            title: 'Confirmation',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'success',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
          })
          .then(value => { 
                self.cleanForm(); //clears form upon confirmation of user 
           })
          .catch(err => { })
      }
    }, 
}
</script>