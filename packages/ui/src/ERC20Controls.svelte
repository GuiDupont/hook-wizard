<script lang="ts">
  import HelpTooltip from './HelpTooltip.svelte';

  import type { KindedOptions } from '@openzeppelin/wizard';
  import { erc20, premintPattern, infoDefaults } from '@openzeppelin/wizard';


  export let opts: Required<KindedOptions['ERC20']> = {
    kind: 'ERC20',
    ...erc20.defaults,
    premint: '', // default to empty premint in UI instead of 0
    info: { ...infoDefaults }, // create new object since Info is nested
  };

  $: requireAccessControl = erc20.isAccessControlRequired(opts);
</script>

<!-- <section class="controls-section">
  <h1>Pool parameters</h1>

    <div class="grid grid-cols-[2fr,1fr] gap-2">
      <label class="labeled-input">
        <span>Token0</span>
        <input bind:value={opts.name}>
      </label>

     <label class="labeled-input">
        <span>Token1</span>
        <input bind:value={opts.name}>
      </label>
    </div>

    <label class="labeled-input">
      <span class="flex justify-between pr-2">
        Init Price
        <HelpTooltip></HelpTooltip>
      </span>
      <input bind:value={opts.premint} placeholder="0" pattern={premintPattern.source}>
    </label>
</section> -->

<section class="controls-section">
  <h1>Fees</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Bumping fees
      <HelpTooltip>
        Fee will decrease until a certain threshold is reached. 
      </HelpTooltip>
    </label>

   
  </div>
</section>

<section class="controls-section">
  <h1>Acces</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.whitelist}>
      Lp whitelist
      <HelpTooltip>
        Limit access to provide liquidity to a limited set of address.
      </HelpTooltip>
    </label>

   
  </div>
   <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Swapper whitelist
      <HelpTooltip>
        Limit access to swap liquidity to a limited set of address.
      </HelpTooltip>
    </label>

   
  </div>
</section>

<!-- <section class="controls-section">
  <h1>Before swap</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>

   
  </div>
</section> -->
<!-- 
<section class="controls-section">
  <h1>After swap</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section>

<section class="controls-section">
  <h1>Whitelist</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section> -->

<!-- 
<section class="controls-section">
  <h1>Before add liquidity</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section>

<section class="controls-section">
  <h1>After add liquidity</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section>

<section class="controls-section">
  <h1>Before rmv liquidity</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section>

<section class="controls-section">
  <h1>After rmv liquidity</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section>

<section class="controls-section">
  <h1>Before donation</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section>

<section class="controls-section">
  <h1>After donation</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>
  </div>
</section> -->