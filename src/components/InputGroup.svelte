<script lang="ts">
  export let label: string;
</script>

<div class="box">
  <h3>{label}</h3>
  <slot />
</div>

<style>
  div {
    background-color: var(--cds-ui-01);
    border-radius: var(--round);
    margin-bottom: var(--aria);
    padding: var(--aria);
  }
  h3 {
    margin: 0;
    font-weight: 500;
    margin-bottom: var(--aria);
  }
</style>
