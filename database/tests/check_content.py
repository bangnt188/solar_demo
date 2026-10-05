"""Validate design fixtures, not production requests. Requires Python jsonschema."""
from copy import deepcopy
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker, ValidationError

ROOT = Path(__file__).resolve().parents[2]
schema = json.loads((ROOT / 'database/schema/landing-content.schema.json').read_text())
fixture = json.loads((ROOT / 'database/seeds/landing-demo.json').read_text())
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema, format_checker=FormatChecker())


def validate(value):
    validator.validate(value)
    sections = value['sections']
    assert len({s['position'] for s in sections}) == 10, 'duplicate section position'
    hero = next(s for s in sections if s['key'] == 'hero')
    assert hero['position'] == 0 and hero['enabled'], 'hero must be visible first'
    slots = []

    def visit(node):
        if isinstance(node, dict):
            for key, child in node.items():
                if key.endswith('Slot'):
                    slots.append(child)
                else:
                    visit(child)
        elif isinstance(node, list):
            for item in node:
                visit(item)

    visit(value['chrome'])
    visit(value['seo'])
    for section in sections:
        visit(section['content'])
        if section['key'] in ('services', 'solutions'):
            items = section['content']['items']
            assert len({i['key'] for i in items}) == len(items), 'duplicate item key'
            for item in items:
                assert item['imageSlot'] == f"{section['key']}.{item['key']}.image", 'unstable media slot'
        if section['key'] == 'whyUs':
            assert [i['key'] for i in section['content']['images']] == ['primary', 'secondary', 'panel'], 'whyUs has three fixed layout roles'
    bindings = value['mediaBindings']
    assert len({b['slot'] for b in bindings}) == len(bindings), 'duplicate media binding'
    assert set(slots) == {b['slot'] for b in bindings}, 'missing or orphan media binding'
    for collection, id_field in [('featuredProjects', 'projectId'), ('featuredEquipment', 'equipmentId')]:
        items = value[collection]
        assert len({i[id_field] for i in items}) == len(items), 'duplicate selection'
        assert len({i['position'] for i in items}) == len(items), 'duplicate selection position'


validate(fixture)
print('PASS: fixture shape, keys, positions, media bindings and catalog selections')


def reject(label, mutate):
    candidate = deepcopy(fixture)
    mutate(candidate)
    try:
        validate(candidate)
    except (ValidationError, AssertionError):
        print(f'PASS: rejected {label}')
        return
    raise AssertionError(f'Accepted invalid payload: {label}')


reject('script action URL', lambda x: x['sections'][0]['content']['primaryAction'].update(href='javascript:alert(1)'))
reject('unrecognized HTML config', lambda x: x['sections'][0]['content'].update(html='<script/>'))
reject('missing third whyUs image', lambda x: next(s for s in x['sections'] if s['key']=='whyUs')['content']['images'].pop())
reject('duplicate section type', lambda x: x['sections'].__setitem__(1, deepcopy(x['sections'][0])))
reject('duplicate section position', lambda x: x['sections'][1].update(position=0))
reject('missing media binding', lambda x: x['mediaBindings'].pop())
reject('arbitrary external navigation', lambda x: x['chrome']['navigation']['items'][0].update(href='https://evil.example'))
reject('unknown UUID', lambda x: x['mediaBindings'][0].update(mediaId='not-a-uuid'))
reject('obsolete nested solution route', lambda x: x['sections'][2]['content']['items'][0].update(href='/giai-phap/ho-gia-dinh/'))
