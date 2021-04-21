<script lang="ts">
  export let values: Array<{ value: string | number; text: string }>;
  export let value: string | number;
  export let label: string;

  import { nanoid } from "nanoid";
  import { createEventDispatcher } from "svelte";

  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }

  const id = nanoid(5);
</script>

<div>
  <label for={id}>{label}</label>
  <select {id} bind:value on:input={dispatchUpdate}>
    {#each values as v}
      <option value={v.value}>
        {v.text}
      </option>
    {/each}
  </select>
</div>

<style>
  div {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: space-between;
    height: var(--input-h);
    align-items: center;
  }

  select {
    color: black;
    height: var(--input-h);
  }
</style>
