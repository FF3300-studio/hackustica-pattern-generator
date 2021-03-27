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

<div class="">
  <label for={id} style="background-color:{color}; color:{color}">{color}</label
  >
  <input
    {id}
    type="number"
    class="input__number"
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
    align-items: center;
    justify-content: space-between;
  }

  label {
    flex-grow: 1;
    height: var(--input-h);
    border-radius: var(--round-s);
    margin-right: calc(var(--aria) / 2);
  }
</style>
