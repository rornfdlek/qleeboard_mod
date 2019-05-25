<template>
  <div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  .back-white {
    background-color: white;
  }

  .border-round {
    border-radius: 15px;
  }

  .custom-divider{
    width: 85%;
    height: 1px;
    background-color: #3c3c3c;
  }

  .float-right-top{
    position:absolute;
    top:0.5rem;
    right:0.5rem;
  }

  .float-left-top{
    position:absolute;
    top:0.5rem;
    left:0.5rem;
  }

</style>
