<template>
 <div class="page-footer-inner" style="float: none;margin: 0px auto;"> 2020 &copy; Powered by Kedauis.
        <a href="http://www.kedauis.com/" title="" target="_blank">Kedauis</a>
    </div>
</template>

<script>
export default {
  name:'Footer',
  mounted(){
    console.log(222)
  }

}
</script>

<style scoped>
  .page-footer-inner{
    text-align: center;
    color: #676565;
    font-size: 13px;
  }
  a{
    color:#2caffb
  }
  a:hover{
    text-decoration: underline;
  }
</style>