use bevy::{math::Vec3A, prelude::*, render::primitives::Aabb};
use bevy_egui::{EguiClipboard, EguiContext, EguiPlugin};
use bevy_flycam::PlayerPlugin;
use bevy_inspector_egui::{egui, WorldInspectorPlugin};
use std::{ffi::OsStr, fs, path::Path};

#[derive(Default)]
struct AppState {
    files: Vec<String>,
    current_index: usize,
    entity: Option<Entity>,

    number_field: usize,
    ident_field: String,
}

fn without_extension(string: &str) -> String {
    string.split('.').next().unwrap().to_string()
}

impl AppState {
    fn despawn(&mut self, commands: &mut Commands) {
        if let Some(entity) = self.entity {
            commands.entity(entity).despawn_recursive();
            self.entity = None;
        }
    }

    fn refresh(&mut self, commands: &mut Commands) {
        let files = fs::read_dir("assets/out")
            .expect("failed to read directory")
            .filter(|entry| entry.as_ref().unwrap().path().extension() == Some(OsStr::new("glb")))
            .map(|entry| entry.unwrap().file_name().to_string_lossy().to_string())
            .collect::<Vec<_>>();

        self.files = files;
        self.current_index = 0;
        self.despawn(commands);
    }

    fn move_current(
        &mut self,
        commands: &mut Commands,
        folder: &str,
        new_name: Option<&str>,
    ) -> Option<()> {
        self.despawn(commands);

        let file = self.files.remove(self.current_index);
        let name = without_extension(&file);

        let new_name = if let Some(new_name) = new_name {
            new_name
        } else {
            &name
        };
        let to_move = [
            file,
            format!("{}.rbxmesh", name),
            format!("{}.rbxmesh.headers", name),
        ];

        let move_to = [
            format!("{}.glb", new_name),
            format!("{}.rbxmesh", new_name),
            format!("{}.rbxmesh.headers", new_name),
        ];

        for idx in 0..to_move.len() {
            let from = &to_move[idx];
            let to = &move_to[idx];
            let to_path = format!("assets/{}/{}", folder, to);

            if Path::new(&to_path).exists() {
                return None;
            }

            fs::rename(format!("assets/out/{}", from), to_path).unwrap();
        }

        // past last index (last was removed)
        if self.current_index == self.files.len() {
            self.current_index -= 1;
        }

        Some(())
    }

    fn delete_current(&mut self, commands: &mut Commands) {
        self.move_current(commands, "discarded", None);
    }
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugin(PlayerPlugin)
        .add_plugin(EguiPlugin)
        .add_plugin(WorldInspectorPlugin::new())
        .insert_resource(AppState::default())
        .add_startup_system(setup)
        .add_system(spawn)
        .add_system(ui)
        .add_system(handle_input)
        .add_system(move_light)
        .add_system(fix_scale)
        .run();
}

fn setup(mut commands: Commands, mut state: ResMut<AppState>) {
    state.refresh(&mut commands);
    // commands.spawn_bundle(InfiniteGridBundle::default());

    const HALF_SIZE: f32 = 1.0;
    commands.spawn_bundle(DirectionalLightBundle {
        directional_light: DirectionalLight {
            shadow_projection: OrthographicProjection {
                left: -HALF_SIZE,
                right: HALF_SIZE,
                bottom: -HALF_SIZE,
                top: HALF_SIZE,
                near: -10.0 * HALF_SIZE,
                far: 10.0 * HALF_SIZE,
                ..default()
            },
            shadows_enabled: true,
            illuminance: 50000.0,
            ..default()
        },
        transform: Transform::from_xyz(0.0, 0.0, 20.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });
}

fn spawn(mut commands: Commands, mut state: ResMut<AppState>, asset_server: Res<AssetServer>) {
    if state.entity.is_none() {
        state.entity = Some(
            commands
                .spawn()
                .insert_bundle(TransformBundle::identity())
                .with_children(|parent| {
                    parent.spawn_scene(asset_server.load(&format!(
                        "out/{}#Scene0",
                        state.files.get(state.current_index).unwrap()
                    )));
                })
                .id(),
        );
    }
}

fn ui(
    mut commands: Commands,
    mut egui_context: ResMut<EguiContext>,
    mut state: ResMut<AppState>,
    mut clipboard: ResMut<EguiClipboard>,
) {
    egui::Window::new("Mesh ID").show(egui_context.ctx_mut(), |ui| {
        let mut file_name = without_extension(&state.files[state.current_index]);

        ui.heading("Current File");
        ui.label(format!("Index {}", state.current_index));
        ui.text_edit_singleline(&mut file_name);

        if ui.button("Copy Name").clicked() {
            clipboard.set_contents(&file_name);
        }

        if ui.button("Discard").clicked() {
            state.delete_current(&mut commands);
        }

        ui.text_edit_singleline(&mut state.ident_field);
        if ui.button("Identify & Move").clicked() {
            let value = state.ident_field.to_string();
            if !value.is_empty() {
                state.move_current(&mut commands, "identified", Some(&value));
                state.ident_field = "".to_string();
            }
        }

        if ui.button("Discard With Name").clicked() {
            let value = state.ident_field.to_string();
            if !value.is_empty() {
                state.move_current(&mut commands, "discarded", Some(&value));
                state.ident_field = "".to_string();
            }
        }

        ui.heading("Skip to file");
        ui.add(egui::DragValue::new(&mut state.number_field));

        if ui.button("Go To").clicked() {
            state.despawn(&mut commands);
            state.current_index = state.number_field.clamp(0, state.files.len());
        }
    });
}

fn handle_input(mut commands: Commands, keys: Res<Input<KeyCode>>, mut state: ResMut<AppState>) {
    if keys.just_pressed(KeyCode::Left) {
        state.despawn(&mut commands);
        if state.current_index == 0 {
            state.current_index = state.files.len() - 1;
        } else {
            state.current_index -= 1;
        }
    }

    if keys.just_pressed(KeyCode::Right) {
        state.despawn(&mut commands);
        if state.current_index == state.files.len() - 1 {
            state.current_index = 0;
        } else {
            state.current_index += 1;
        }
    }

    if keys.just_pressed(KeyCode::Delete) {
        state.delete_current(&mut commands);
    }
}

fn move_light(
    cam_query: Query<&Transform, With<Camera>>,
    mut light_query: Query<&mut Transform, (With<DirectionalLight>, Without<Camera>)>,
) {
    let cam_t = cam_query.single();
    let mut light_t = light_query.single_mut();

    light_t.translation = cam_t.translation;
    light_t.rotation = cam_t.rotation;
}

fn fix_scale(mut query: Query<(&mut Transform, &Aabb)>) {
    for (mut transform, aabb) in query.iter_mut() {
        let scale = (Vec3A::new(5.0, 5.0, 5.0) / (aabb.half_extents * 2.0)).min_element();
        transform.scale = Vec3::ONE * scale;
    }
}
