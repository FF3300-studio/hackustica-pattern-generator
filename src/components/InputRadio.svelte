<script lang="ts">
  export let items: Array<any>;
  export let labels: Record<any, string>;
  export let value;

  import { createEventDispatcher } from "svelte";
  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }
</script>

{#each items as item}
  <label class="radio__label">
    <input
      type="radio"
      on:change={dispatchUpdate}
      bind:group={value}
      value={item}
    />
    {labels[item]}
  </label>
{/each}

<style>
  .radio__label {
    margin-bottom: calc(var(--aria) / 2);
    display: flex;
    flex-flow: row-reverse nowrap;
    justify-content: space-between;
    align-items: center;
    min-height: var(--input-h);
    background-color: var(--cds-ui-02);
    border-radius: var(--round-s);
    padding: 10px;
  }

  input[type="radio"] {
    flex-shrink: 0;
  }

  .radio__label:hover {
    background-color: var(--cds-ui-03);
  }

  label:last-child {
    margin-bottom: 0;
  }
</style>
