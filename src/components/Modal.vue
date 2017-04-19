<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" >

          <div @click="$emit('close')">
            <svg class="icon icon-cancel-circle"><use xlink:href="#icon-cancel-circle"></use></svg>
          </div>

          <div class="modal-header">
            <slot name="header">
              <h2>Default header</h2>
            </slot>
          </div>

          <div @click="$emit('close')" class="modal-body">
            <slot name="body">
              <a>default body</a>
            </slot>
          </div>

          <div @click="$emit('close')" class="modal-footer">
            <slot name="footer">
            </slot>
          </div>
        </div>
      </div>
    <symbol id="icon-cancel-circle" viewBox="0 0 32 32">
      <title>cancel-circle</title>
      <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
      <path d="M21 8l-5 5-5-5-3 3 5 5-5 5 3 3 5-5 5 5 3-3-5-5 5-5z"></path>
    </symbol>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'modal'
}
</script>

<style scoped>
.icon-cancel-circle {
  position: absolute;
  left: 10px;
  font-size: 18px;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  position: relative;
  width: 300px;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .2s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  margin: 18px 0;
  color: black;
}

.modal-body {
  display: block;
  margin: 20px 0;
}

.modal-body a {
  display: block;
  margin: 20px 0;
}

.modal-default-button {
  color: #e74c3c;
  float: right;
}

.login-slot--link {
  color: black;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
