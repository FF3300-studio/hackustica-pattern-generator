<script lang="ts">
  /**
   * Imports
   */

  import { nanoid } from "nanoid";
  import { createEventDispatcher } from "svelte";

  /**
   * Parameters
   */

  export let label: string;
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

<div>
  <label for={id}>{label}</label>
  <input
    {id}
    class="input__number"
    type="number"
    on:change={dispatchUpdate}
    bind:value
    min="0"
    step="1"
  />
</div>

<style>
  div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: baseline;
  }
</style>
