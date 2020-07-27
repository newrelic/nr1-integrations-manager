/* eslint 
no-console: 0
*/
import React from 'react';
import { Card, Label, Icon, Image } from 'semantic-ui-react';

export default class IntegrationTiles extends React.PureComponent {
  render() {
    const { integrations } = this.props;

    return (
      <Card.Group>
        {integrations.map((i, z) => {
          return (
            <Card key={z} href="#" color="teal">
              <Card.Content>
                {i.image ? (
                  <Image floated="left" size="mini" src={i.image} />
                ) : (
                  ''
                )}
                <Card.Header style={{ marginTop: '10px' }}>
                  <div style={{ float: 'left' }}>{i.name}</div>
                  {i.git ? (
                    <div
                      style={{ float: 'right' }}
                      onClick={() => window.open(i.git, '_blank')}
                    >
                      <Label color="green" style={{ cursor: 'pointer' }}>
                        <Icon name="github" /> GitHub
                      </Label>
                    </div>
                  ) : (
                    ''
                  )}
                </Card.Header>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    );
  }
}
