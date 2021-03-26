<script lang="ts">
  /**
   * Imports
   */

  import { nanoid } from "nanoid";
  import { createEventDispatcher } from "svelte";

  /**
   * Parameters
   */

  export let color: string;
  export let value: number;

  /**
   * Logic
   */

  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }

  // Generating random id
  const id: string = nanoid(5);
</script>

<label for={id} style="background-color:{color}; color:{color}">{color}</label>
<input
  {id}
  type="number"
  on:change={dispatchUpdate}
  bind:value
  min="0"
  step="1"
/>
