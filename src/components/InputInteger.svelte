<script lang="ts">
  import { nanoid } from "nanoid";

  export let label: string;
  export let value: number;

  // Generating random id
  const id: string = nanoid(5);
</script>

<label for={id}>{label}</label>
<input {id} type="number" bind:value min="0" step="1" />
