<script lang="ts">
  export let label: string;
</script>

<div class="box">
  <p><strong>{label}</strong></p>
  <slot />
</div>

<style>
  /* .box {
    width: fit-content;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 0 0 1em 0;
  } */
</style>
