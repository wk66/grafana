///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import {Emitter, contextSrv, appEvents, assignModelProperties} from 'app/core/core';

export class DashboardRow {
  panels: any;
  title: any;
  showTitle: any;
  titleSize: any;
  events: Emitter;
  span: number;
  height: number;
  collapse: boolean;

  defaults = {
    title: 'Dashboard Row',
    panels: [],
    showTitle: false,
    titleSize: 'h6',
    height: 250,
    isNew: false,
    repeat: null,
    repeatRowId: null,
    repeatIteration: null,
    collapse: false,
  };

  constructor(private model) {
    assignModelProperties(this, model, this.defaults);
    this.events = new Emitter();
    this.updateRowSpan();
  }

  getSaveModel() {
    assignModelProperties(this.model, this, this.defaults);
    return this.model;
  }

  updateRowSpan() {
    this.span = 0;
    for (let panel of this.panels) {
      this.span += panel.span;
    }
  }

  panelSpanChanged() {
    var oldSpan = this.span;
    this.updateRowSpan();

    if (oldSpan !== this.span) {
      this.events.emit('span-changed');
    }
  }

  addPanel(panel) {
    var rowSpan = this.span;
    var panelCount = this.panels.length;
    var space = (12 - rowSpan) - panel.span;

    // try to make room of there is no space left
    if (space <= 0) {
      if (panelCount === 1) {
        this.panels[0].span = 6;
        panel.span = 6;
      } else if (panelCount === 2) {
        this.panels[0].span = 4;
        this.panels[1].span = 4;
        panel.span = 4;
      } else if (panelCount === 3) {
        this.panels[0].span = 3;
        this.panels[1].span = 3;
        this.panels[2].span = 3;
        panel.span = 3;
      }
    }

    this.panels.push(panel);
    this.events.emit('panel-added', panel);
    this.panelSpanChanged();
  }

  removePanel(panel, ask?) {
    if (ask !== false) {
      appEvents.emit('confirm-modal', {
        title: 'Remove Panel',
        text: 'Are you sure you want to remove this panel?',
        icon: 'fa-trash',
        yesText: 'Remove',
        onConfirm: () => {
          this.removePanel(panel, false);
        }
      });
      return;
    }

    var index = _.indexOf(this.panels, panel);
    this.panels.splice(index, 1);
    this.events.emit('panel-removed', panel);
    this.panelSpanChanged();
  }

  movePanel(fromIndex, toIndex) {
    this.panels.splice(toIndex, 0, this.panels.splice(fromIndex, 1)[0]);
  }

  destroy() {
    this.events.removeAllListeners();
  }

  copyPropertiesFromRowSource(source) {
    this.height = source.height;
    this.title = source.title;
    this.showTitle = source.showTitle;
    this.titleSize = source.titleSize;
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }
}

