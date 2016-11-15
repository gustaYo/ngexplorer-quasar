<template>
	<quasar-layout>
	<div slot="header" class="toolbar">
		<button @click="close()"><i>arrow_back</i></button>
		<div class="toolbar-content">
			<div class="toolbar-title padding-2">
				<div>Buscar negocio</div>
			</div>
		</div>
		<div class="toolbar-buttons">
			<button><i>search</i></button>
		</div>
	</div>

	<div slot="header" class="toolbar primary">
		<quasar-search :model.sync="search" class="primary"></quasar-search>
	</div>

	<quasar-tabs slot="navigation">
	<quasar-tab :target="target1" icon="mail" active="true">Listado</quasar-tab>
	<quasar-tab :target="target2" icon="place">Mapa</quasar-tab>
	<quasar-tab :target="target3" icon="help">Help</quasar-tab>
</quasar-tabs>

<div class="layout-view">
	<div class="layout-padding">
		<div id="tab-1" class="tab" >
			<div class="row gutter sm-column wrap">
				<div class="width-1of4" v-for="n in 8">
					<div class="card" >
						<div class="item">
							<img class="avatar" src="/statics/linux-avatar.png">
							<div class="item-content">
								<div class="item-label">
									<p class="item-title">Gustavo Crespo Sanchez</p>
									<p>Web Developer</p>
								</div>
							</div>
						</div>
						<img src="/statics/mountains.jpg">
						<div class="card-content">
							Card Content
						</div>
						<div class="card-actions">
							<div class="text-primary">
								<i>thumb_up</i> 11k likes
							</div>
							<div class="text-primary">
								<i>mode_comment</i> 8 comments
							</div>
							<div class="auto"></div>
							<div class="text-grey-6">
								23 minutes ago.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="tab-2" class="tab">
			<div class="label circular bg-primary text-white">no displonible</div>
		</div>
		<div id="tab-3" class="tab">
			<div v-for="n in 7">Tab 3</div>
		</div>

	</div>
</div>
</div>
</quasar-layout>
</template>

<script>
export default {
  data () {
    return {
      target1: '#tab-1',
      target2: '#tab-2',
      target3: '#tab-3',
      select: 'fb',
      multipleSelect: ['goog', 'twtr'],
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ]
    }
  },
  methods: {
  }
}
</script>
