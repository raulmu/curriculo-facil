import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CepService } from 'src/app/services/cep.service';
import { Curriculo } from 'src/app/services/curriculo';
import { CurriculoList } from 'src/app/services/curriculoList';
import { CurriculosService } from 'src/app/services/curriculos.service';
import { Experiencia } from 'src/app/services/experiencia';
import { FotoService } from 'src/app/services/foto.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-formulario-curriculo',
  templateUrl: './formulario-curriculo.component.html',
  styleUrls: ['./formulario-curriculo.component.scss'],
})
export class FormularioCurriculoComponent implements OnInit {
  curriculosList: CurriculoList | undefined = undefined;
  curriculoSelected: Curriculo | undefined = undefined;
  uid: string | null = null;
  userUid: string;
  public fotoDataUrl: string = '';
  estadoCivisList = [
    'Solteiro',
    'Solteira',
    'Casado',
    'Casada',
    'Viúvo',
    'Viúva',
    'Divorciado',
    'Divorciada',
  ];
  escolaridadeList = [
    'Ensino Fundamental - Completo',
    'Ensino Fundamental - Incompleto',
    'Ensino Médio - Completo',
    'Ensino Médio - Incompleto',
    'Curso Técnico - Completo',
    'Curso Técnico - Incompleto',
    'Curso Superior - Completo',
    'Curso Superior - Incompleto',
    'Pós Graduação - Especialização - Completo',
    'Pós Graduação - Especialização - Incompleto',
    'Pós Graduação - MBA - Completo',
    'Pós Graduação - MBA - Incompleto',
    'Pós Graduação - Mestrado - Completo',
    'Pós Graduação - Mestrado - Incompleto',
    'Pós Graduação - Doutorado - Completo',
    'Pós Graduação - Doutorado - Incompleto',
  ];

  fakeData = {
    name: '',
    identifier: '',
    email: '',
    estado_civil: '',
  };

  public curriculoForm = new FormGroup({
    name: new FormControl(this.fakeData.name, [
      Validators.required,
      Validators.maxLength(35),
    ]),
    identifier: new FormControl(this.fakeData.identifier, [
      Validators.required,
      Validators.maxLength(25),
    ]),
    email: new FormControl(this.fakeData.email, [
      Validators.required,
      Validators.email,
      Validators.maxLength(30),
    ]),
    estado_civil: new FormControl(this.fakeData.estado_civil, [
      Validators.required,
      FormularioCurriculoComponent.checkCategoryInput(this.estadoCivisList),
    ]),
    data_nascimento: new FormControl(new Date(''), [
      Validators.required,
      FormularioCurriculoComponent.checkIsValidDate(),
    ]),
    nacionalidade: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    telefone: new FormControl('', [
      Validators.required,
      Validators.maxLength(16),
    ]),
    whatsapp: new FormControl(false, [Validators.required]),
    compartilhar: new FormControl(false, [Validators.required]),
    cep: new FormControl('', [
      Validators.required,
      Validators.maxLength(9),
      Validators.minLength(8),
    ]),
    rua: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    bairro: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    estado: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    cidade: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    numero: new FormControl('', [Validators.maxLength(10)]),
    complemento: new FormControl('', [Validators.maxLength(20)]),
    escolaridade: new FormControl('', [
      Validators.required,
      FormularioCurriculoComponent.checkCategoryInput(this.escolaridadeList),
    ]),
    descricao_escolaridade: new FormControl('', [
      Validators.maxLength(70),
    ]),
    cursos: new FormArray([]),
    objetivo: new FormControl('', [
      Validators.required,
      Validators.maxLength(150),
    ]),
    experiencias: new FormArray([]),
  });

  constructor(
    private curriculosService: CurriculosService,
    private route: ActivatedRoute,
    public _nav: NavigateService,
    private cepService: CepService,
    private progressBarService: ProgressBarService,
    private dateAdapter: DateAdapter<Date>,
    private fotoService: FotoService,
    private pdfService: PdfService,
    private authService: AuthService
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.userUid = authService.userData ? authService.userData.uid : '';
    this.curriculosService.curriculoList?.subscribe((userCurriculos) => {
      this.curriculosList = userCurriculos;
      this.curriculoSelected = this.curriculosList?.curriculos.filter(
        (el: any) => (el.uid = this.uid)
      )[0];
      if (this.curriculoSelected) this.preencheValoresIniciais();

      if (!this.fotoService.isPersisted.getValue()) {
        this.fotoDataUrl = `${this.fotoService.getDataUrl().getValue()}`;
        this.gravar(false);
      }
      this.curriculoForm.markAllAsTouched();
    });
  }
  ngOnInit(): void {
    this.dateAdapter.setLocale({ pt: 'pt' });
  }

  preencheValoresIniciais() {
    let dataStr = this.curriculoSelected!.data_nascimento!;
    this.fotoDataUrl = this.curriculoSelected!.fotoDataUrl;
    dataStr = dataStr || '';
    let obj: any = {
      name: this.curriculoSelected!.name,
      identifier: this.curriculoSelected!.identifier,
      email: this.curriculoSelected!.email,
      data_nascimento: new Date(dataStr),
      estado_civil: this.curriculoSelected!.estado_civil,
      nacionalidade: this.curriculoSelected!.nacionalidade,
      telefone: this.curriculoSelected!.telefone,
      whatsapp: this.curriculoSelected!.whatsapp,
      compartilhar: this.curriculoSelected!.compartilhar,
      cep: this.curriculoSelected!.cep,
      rua: this.curriculoSelected!.rua,
      bairro: this.curriculoSelected!.bairro,
      estado: this.curriculoSelected!.estado,
      cidade: this.curriculoSelected!.cidade,
      numero: this.curriculoSelected!.numero,
      complemento: this.curriculoSelected!.complemento,
      escolaridade: this.curriculoSelected!.escolaridade,
      descricao_escolaridade: this.curriculoSelected!.descricao_escolaridade,
      objetivo: this.curriculoSelected!.objetivo,
    };
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) obj[key] = '';
    });
    this.curriculoForm.patchValue(obj);
    const cursos = this.curriculoSelected!.cursos;
    this.curriculoForm.controls['cursos'] = new FormArray([]);
    if (cursos?.length) {
      cursos.map((el) => {
        if (el.length) this.addCurso(el);
      });
    }
    const experiencias = this.curriculoSelected!.experiencias;
    this.curriculoForm.controls['experiencias'] = new FormArray([]);
    if (experiencias?.length) {
      experiencias.map((el) => {
        if (el) this.addExperiencia(el);
      });
    }
  }

  // https://www.positronx.io/create-angular-firebase-crud-app-with-angular-material/

  public static checkCategoryInput(categoryList: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val = control.value;
      if (categoryList.includes(val)) return null;
      return { 'not-in-list': val };
    };
  }

  public static checkIsValidDate() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val = control.value;
      if (FormularioCurriculoComponent.isValidDate(new Date(val))) return null;
      return { 'not-valid-date': val };
    };
  }

  public static isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  getCurriculoFromForm(): Curriculo | null {
    let curriculo: Curriculo | null = null;
    if (this.isFormValid()) {
      let experiencias: Experiencia[] = [];
      if (this.experiencias.controls.length) {
        experiencias = this.experiencias.controls.map((group) => {
          const experiencia: Experiencia = {
            ...group.value,
          };
          return experiencia;
        });
      }
      curriculo = {
        uid: this.uid!,
        ...this.curriculoForm.getRawValue(),
        data_nascimento: new Intl.DateTimeFormat('en-US').format(
          this.curriculoForm.controls['data_nascimento'].value || undefined
        ),
        experiencias,
        fotoDataUrl: this.fotoDataUrl,
      };
      curriculo!.uid = curriculo!.uid ? curriculo!.uid : uuidv4();
    }
    return curriculo;
  }

  gravar(redirect: boolean = true) {
    this.progressBarService.show.next(true);
    if (this.isFormValid()) {
      const curriculo = this.getCurriculoFromForm()!;
      if (!this.isEditMode()) {
        this.curriculosList?.curriculos.push(curriculo);
      } else {
        const newList = this.curriculosList?.curriculos.filter(
          (el: any) => el.uid != this.uid
        );
        newList.push(curriculo);
        this.curriculoSelected = curriculo;
        this.curriculosList!.curriculos = newList;
      }
      this.curriculosService
        .updateCurriculosList(this.curriculosList)
        .then((_) => {
          this.fotoService.isPersisted.next(true);
          this.progressBarService.show.next(false);
          redirect &&
            this._nav.navigateTo(
              'painel',
              this.authService.userData ? this.authService.userData.uid : ''
            );
        })
        .catch((err) => {
          this.progressBarService.show.next(false);
          console.log({ err });
        });
    }
  }

  isEditMode() {
    return !!this.uid;
  }

  public pageTitle(): string {
    if (this.isEditMode()) {
      return 'Edição de Currículo';
    }
    return 'Cadastro de Currículo';
  }

  isFormValid() {
    return this.curriculoForm.valid;
  }
  isCepValid() {
    let cep = this.curriculoForm.value.cep!.replace('-', '');
    return cep.length == 8 && _isNumberValue(cep);
  }
  consultarCep() {
    this.progressBarService.show.next(true);
    this.cepService.getData(this.curriculoForm.value.cep!).subscribe(
      (data: any) => {
        this.curriculoForm.controls['rua'].setValue(data.street);
        this.curriculoForm.controls['bairro'].setValue(data.neighborhood);
        this.curriculoForm.controls['cidade'].setValue(data.city);
        this.curriculoForm.controls['estado'].setValue(data.state);
        this.progressBarService.show.next(false);
      },
      (err) => {
        console.log(err);
        this.progressBarService.show.next(false);
      }
    );
  }
  get cursos() {
    return this.curriculoForm.get('cursos') as FormArray;
  }
  get experiencias() {
    return this.curriculoForm.get('experiencias') as FormArray;
  }

  addCurso(texto: string) {
    if (this.podeAddCurso())
      this.cursos.push(
        new FormControl(texto, [Validators.required, Validators.maxLength(50)])
      );
  }

  addExperiencia(experiencia?: Experiencia) {
    if (this.podeAddExperiencia()) {
      this.experiencias.push(
        new FormGroup({
          empresa: new FormControl(experiencia ? experiencia.empresa : '', [
            Validators.required,
            Validators.maxLength(50),
          ]),
          periodo: new FormControl(experiencia ? experiencia.periodo : '', [
            Validators.required,
            Validators.maxLength(50),
          ]),
          cargo: new FormControl(experiencia ? experiencia.cargo : '', [
            Validators.required,
            Validators.maxLength(50),
          ]),
          atividades_exercidas: new FormControl(
            experiencia ? experiencia.atividades_exercidas : '',
            [Validators.maxLength(150)]
          ),
        })
      );
    }
  }
  deleteCurso(index: number) {
    this.cursos.removeAt(index);
  }
  podeAddCurso() {
    return this.cursos.length < 3;
  }
  podeAddExperiencia() {
    return this.experiencias.length < 3;
  }
  deleteExperiencia(index: number) {
    this.experiencias.removeAt(index);
  }
  gerarPDF() {
    if (!this.disablePDF()) {
      this.pdfService.curriculo.next(this.getCurriculoFromForm());
      this._nav.navigateTo(
        'pdf-preview/curriculuid',
        this.authService.userData ? this.authService.userData.uid : ''
      );
    }
  }
  disablePDF() {
    return !this.uid || !this.isFormValid;
  }
  addPhoto() {
    this._nav.navigateTo(
      `/upload-foto/${this.uid}`,
      this.authService.userData ? this.authService.userData.uid : ''
    );
  }
  delPhoto() {
    this.fotoDataUrl = '';
    this.fotoService.setDataUrl('');
    this.gravar(false);
  }
}
