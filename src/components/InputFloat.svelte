<script lang="ts">
  export let id: string;
  export let value: number;
</script>

<input {id} type="number" bind:value min="0" step="0.01" />
